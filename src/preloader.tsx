import React, { ComponentType } from "react"
import ReactDOM from "react-dom/server"
import { createPreloaderContext } from "./preloader-context"
import { InternalData, Preloader, WrappedComponent } from "./types"
import { asyncMapValues } from "./util"
import { makeWrappedComponent } from "./wrapped-components"

class InternalPreloader<P> implements Preloader<P> {
  constructor(private _innerComponent: ComponentType<P>) {}

  component = makeWrappedComponent(this._innerComponent)

  async preloadData(props: P): Promise<WrappedComponent.Props<P>> {
    const memory: Record<string, InternalData.MemoryCell> = {}

    ReactDOM.renderToStaticMarkup(
      <this.component
        {...props}
        __usepreswr_preloaded_props__={createPreloaderContext({
          isCollecting: true,
          memory,
        })}
      />
    )

    const preloadedMemory = await asyncMapValues(
      memory,
      async ({ normalizedKey, fetcher, initialData }) => {
        if (initialData != null) return [normalizedKey, initialData]
        return [normalizedKey, await fetcher(...normalizedKey)]
      }
    )

    return {
      ...props,
      __usepreswr_preloaded_props__: createPreloaderContext({
        memory: preloadedMemory,
      }),
    }
  }
}

export const makePreloader: <T>(
  innerComponent: ComponentType<T>
) => Preloader<T> = (innerComponent) => new InternalPreloader(innerComponent)

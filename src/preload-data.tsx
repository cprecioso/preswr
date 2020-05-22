import React from "react"
import ReactDOM from "react-dom/server"
import { createPreloaderContext } from "./preloader-context"
import { InternalData, WrappedComponent } from "./types"
import { asyncMapValues } from "./util"

export interface PreloadDataOptions {
}

export const preloadData: <P>(
  wrappedComponent: WrappedComponent<P>,
  props: P
) => Promise<WrappedComponent.Props<P>> = async (WrappedComponent, props) => {
  const memory: Record<string, InternalData.MemoryCell> = {}

  ReactDOM.renderToStaticMarkup(
    <WrappedComponent
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
      if (initialData != null) return initialData
      return await fetcher(...normalizedKey)
    }
  )

  return {
    ...props,
    __usepreswr_preloaded_props__: createPreloaderContext({
      memory: preloadedMemory,
    }),
  }
}

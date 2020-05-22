import React from "react"
import ReactDOM from "react-dom/server"
import stream from "stream"
import { createPreloaderContext } from "./preloader-context"
import { InternalData, WrappedComponent } from "./types"
import { asyncMapValues } from "./util"

export interface PreloadDataOptions {
  /**
   * Maximum amount of times that PreSWR will re-render your component tree
   * looking for changes in the data fatching. Set to `false` to disable deep
   * rendering.
   *
   * @default 10
   */
  maxDepth: number | false
}

const renderToMemory: <P>(
  wrappedComponent: WrappedComponent<P>,
  props: P,
  memory: Record<string, InternalData.MemoryCell>
) => Promise<void> = async (WrappedComponent, props, memory) =>
  await new Promise((f, r) => {
    const reactStream = ReactDOM.renderToStaticNodeStream(
      <WrappedComponent
        {...props}
        __usepreswr_preloaded_props__={createPreloaderContext({
          isCollecting: true,
          memory,
        })}
      />
    )
    reactStream.once("error", (err) => {
      reactStream.removeAllListeners()
      r(err)
    })
    reactStream.once("end", () => {
      reactStream.removeAllListeners()
      f()
    })
    reactStream.pipe(new stream.Writable({ write: (chunk, enc, cb) => cb() }))
  })

export const preloadData: <P>(
  wrappedComponent: WrappedComponent<P>,
  props: P,
  options?: Partial<PreloadDataOptions>
) => Promise<WrappedComponent.Props<P>> = async (
  WrappedComponent,
  props,
  { maxDepth = 10 } = {}
) => {
  let memory: Record<string, InternalData.MemoryCell> = {}

  await renderToMemory(WrappedComponent, props, memory)

  let currentDepth = 0
  do {
    memory = await asyncMapValues(
      memory,
      async ({ normalizedKey, fetcher, initialData }) => {
        if (initialData != null) return { initialData }
        return { initialData: await fetcher!(...normalizedKey!) }
      }
    )

    if (maxDepth === false) break
    if (currentDepth++ >= maxDepth) throw new Error("Max depth reached")

    const newMemory = { ...memory }
    await renderToMemory(WrappedComponent, props, newMemory)

    if (
      JSON.stringify(Object.keys(memory).sort()) ===
      JSON.stringify(Object.keys(newMemory).sort())
    )
      break

    memory = newMemory
  } while (true)

  const internalProps = createPreloaderContext({ memory })
  return { ...props, __usepreswr_preloaded_props__: internalProps }
}

import React, { ComponentType } from "react"
import { createPreloaderContext, PreloaderProvider } from "./preloader-context"
import { InternalData, WrappedComponent } from "./types"

export const makeWrappedComponent: <T>(
  component: ComponentType<T>
) => WrappedComponent<T> = (InnerComponent) => ({
  __usepreswr_preloaded_props__,
  ...props
}) => {
  const [data] = React.useState<InternalData>(
    () => __usepreswr_preloaded_props__ ?? createPreloaderContext()
  )

  return (
    <PreloaderProvider value={data}>
      {
        // @ts-expect-error
        <InnerComponent {...props} />
      }
    </PreloaderProvider>
  )
}

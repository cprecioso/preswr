import { ComponentType } from "react"
import { preloadData, PreloadDataOptions } from "./preload-data"
import { WrappedComponent } from "./types"
import { makeWrappedComponent } from "./wrapped-components"

export interface Preloader<P> {
  Component: WrappedComponent<P>
  preloadData: (
    props: P,
    options?: Partial<PreloadDataOptions>
  ) => Promise<WrappedComponent.Props<P>>
}

export const makePreloader = <T>(
  innerComponent: ComponentType<T>
): Preloader<T> => {
  const Component = makeWrappedComponent(innerComponent)
  return {
    Component,
    preloadData: async (props: T) => preloadData(Component, props),
  }
}

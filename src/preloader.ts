import { ComponentType } from "react"
import { preloadData, PreloadDataOptions } from "./preload-data"
import { WrappedComponent } from "./types"
import { makeWrappedComponent } from "./wrapped-components"

export interface Preloader<P> {
  /**
   * Your component wrapped in an internal component, which sets up the
   * preloaded data.
   */
  Component: WrappedComponent<P>

  /**
   * Call this function to actually fetch the data requested in your component,
   * with the given props. You can supply an optional options object.
   *
   * The return value is the original props object plus an internal property
   * holding the preloaded data.
   */
  preloadData: (
    props: P,
    options?: Partial<PreloadDataOptions>
  ) => Promise<WrappedComponent.Props<P>>
}

/**
 * Wrap your component in the internal preloader components, and provide a
 * preloading function.
 */
export const makePreloader = <T>(
  innerComponent: ComponentType<T>
): Preloader<T> => {
  const Component = makeWrappedComponent(innerComponent)
  return {
    Component,
    preloadData: async (props: T, options?: Partial<PreloadDataOptions>) =>
      preloadData(Component, props, options),
  }
}

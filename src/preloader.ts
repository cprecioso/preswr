import { ComponentType } from "react"
import { preloadData } from "./preload-data"
import { Preloader } from "./types"
import { makeWrappedComponent } from "./wrapped-components"

export const makePreloader = <T>(
  innerComponent: ComponentType<T>
): Preloader<T> => {
  const Component = makeWrappedComponent(innerComponent)
  return {
    Component,
    preloadData: async (props: T) => preloadData(Component, props),
  }
}

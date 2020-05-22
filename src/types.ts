import { ComponentType } from "react"
import { ConfigInterface as SWRConfigInterface } from "swr"
import { Preloader } from "./preloader"

/**
 * The function that will actually fetch the data.
 */
export type Fetcher<D> = (...args: any[]) => Promise<D>

/**
 * Configuration options for the usePreSWR hook. Inherited from SWR.
 */
export type ConfigInterface<Data = any, Err = any> = SWRConfigInterface<
  Data,
  Err,
  Fetcher<Data>
>

/**
 * Internal object holding the current preloading status.
 * Not guaranteed to be stable.
 */
export interface InternalData {
  readonly isCollecting: boolean
  memory: Record<string, InternalData.MemoryCell>
}

export namespace InternalData {
  export interface MemoryCell<D = any> {
    normalizedKey?: any[]
    fetcher?: Fetcher<D>
    initialData?: D
  }
}

/**
 * The wrapped component's props key that holds the internal preloading state.
 * Not guaranteed to be stable.
 *
 * Is your usecase impossible without accessing this prop?
 * Then please open an issue at the GitHub repository.
 */
export const WRAPPED_COMPONENT_INTERNAL_KEY =
  "__usepreswr_internal_preloaded_props__"

/**
 * The type of a wrapped component, based on the underlying props.
 */
export type WrappedComponent<T> = ComponentType<WrappedComponent.Props<T>>

export namespace WrappedComponent {
  /**
   * Props of a wrapped component, based on the underlying ones.
   */
  export type Props<T> = T & WrappedComponent.InternalProps

  /**
   * Extra props given to wrapped components.
   * Not guaranteed to be stable.
   */
  export interface InternalProps {
    /**
     * Internal prop holding preloading state.
     * Not guaranteed to be stable.
     *
     * Is your usecase impossible without accessing this prop?
     * Then please open an issue at the GitHub repository.
     */
    [WRAPPED_COMPONENT_INTERNAL_KEY]?: InternalData
  }
}

/**
 * Use this type to get the wrapped components props
 * (including the internal one holding the preloaded state).
 */
export type PreloaderProps<T extends Preloader<any>> = T extends Preloader<
  infer P
>
  ? WrappedComponent.Props<P>
  : never

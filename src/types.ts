import { ComponentType } from "react"
import { ConfigInterface as SWRConfigInterface } from "swr"

export type Serializable =
  | string
  | number
  | { [key: string]: Serializable }
  | Serializable[]
  | boolean
  | null

export type Fetcher<D extends Serializable> = (...args: any[]) => Promise<D>

export type ConfigInterface<
  Data extends Serializable = any,
  Err = any
> = SWRConfigInterface<Data, Err, Fetcher<Data>>

export type InternalData = InternalData.CollectPhase | InternalData.HydratePhase
export namespace InternalData {
  interface _Base {
    readonly isCollecting: boolean
  }

  export interface CollectPhase extends _Base {
    readonly isCollecting: true
    memory: Record<string, MemoryCell>
  }

  export interface MemoryCell<D extends Serializable = any> {
    normalizedKey: any[]
    fetcher: Fetcher<D>
    initialData?: D
  }

  export interface HydratePhase extends _Base {
    readonly isCollecting: false
    memory: Record<string, any>
  }
}

export const WRAPPED_COMPONENT_INTERNAL_KEY = "__usepreswr_preloaded_props__"
export type WrappedComponent<T> = ComponentType<WrappedComponent.Props<T>>
export namespace WrappedComponent {
  export type Props<T> = T & WrappedComponent.InternalProps

  export interface InternalProps {
    [WRAPPED_COMPONENT_INTERNAL_KEY]?: InternalData
  }
}

export interface Preloader<P> {
  Component: WrappedComponent<P>
  preloadData: (props: P) => Promise<WrappedComponent.Props<P>>
}

export type PreloaderProps<T extends Preloader<any>> = T extends Preloader<
  infer P
>
  ? WrappedComponent.Props<P>
  : never

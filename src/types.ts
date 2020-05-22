import { ComponentType } from "react"
import { ConfigInterface as SWRConfigInterface } from "swr"
import { Preloader } from "./preloader"

export type Fetcher<D> = (...args: any[]) => Promise<D>

export type ConfigInterface<Data = any, Err = any> = SWRConfigInterface<
  Data,
  Err,
  Fetcher<Data>
>

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

export const WRAPPED_COMPONENT_INTERNAL_KEY =
  "__usepreswr_internal_preloaded_props__"
export type WrappedComponent<T> = ComponentType<WrappedComponent.Props<T>>
export namespace WrappedComponent {
  export type Props<T> = T & WrappedComponent.InternalProps

  export interface InternalProps {
    [WRAPPED_COMPONENT_INTERNAL_KEY]?: InternalData
  }
}

export type PreloaderProps<T extends Preloader<any>> = T extends Preloader<
  infer P
>
  ? WrappedComponent.Props<P>
  : never

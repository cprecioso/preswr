import React from "react"
import useSWR, { keyInterface, responseInterface } from "swr"
import { useConfigContext } from "./config-context"
import { defaultFetcher } from "./default-fetcher"
import { usePreloaderContext } from "./preloader-context"
import { ConfigInterface, Fetcher } from "./types"
import { normalizeKey } from "./util"

/**
 * Hook for preloading data, and fetching it at runtime.
 */
declare function _usePreSWR<Data = any, Err = any>(
  /**
   * Unique key for the request (and arguments for the fetcher)
   */
  key: keyInterface
): responseInterface<Data, Err>

/**
 * Hook for preloading data, and fetching it at runtime.
 */
declare function _usePreSWR<Data = any, Err = any>(
  /**
   * Unique key for the request (and arguments for the fetcher)
   */
  key: keyInterface,

  /**
   * Configuration for this data fetching
   */
  config?: ConfigInterface<Data, Err>
): responseInterface<Data, Err>

/**
 * Hook for preloading data, and fetching it at runtime.
 */
declare function _usePreSWR<Data = any, Err = any>(
  /**
   * Unique key for the request (and arguments for the fetcher)
   */
  key: keyInterface,

  /**
   * Data fetching function, will take the `key` as argument(s).
   */
  fetcher?: Fetcher<Data>,

  /**
   * Configuration for this data fetching
   */
  config?: ConfigInterface<Data, Err>
): responseInterface<Data, Err>

/**
 * Hook for preloading data, and fetching it at runtime.
 */
export const usePreSWR: typeof _usePreSWR = <Data = any, Err = any>(
  key: keyInterface,
  fetcherOrConfig?: Fetcher<Data> | ConfigInterface<Data, Err>,
  maybeConfig?: ConfigInterface
): responseInterface<Data, Err> => {
  const data = usePreloaderContext()

  const [initialData] = React.useState(() => {
    const normalizedKey = normalizeKey(key)
    const stringKey = JSON.stringify(normalizedKey)
    return data.memory[stringKey]?.initialData
  })

  const config =
    maybeConfig ??
    (typeof fetcherOrConfig !== "function" ? fetcherOrConfig : null) ??
    {}

  const fetcher =
    (typeof fetcherOrConfig === "function" ? fetcherOrConfig : null) ??
    config?.fetcher ??
    useConfigContext().fetcher ??
    defaultFetcher

  if (data.isCollecting) {
    const normalizedKey = normalizeKey(key)
    const stringKey = JSON.stringify(normalizedKey)

    if (normalizedKey != null) {
      data.memory[stringKey] = {
        normalizedKey,
        fetcher,
        initialData: config?.initialData,
      }
    }
  }

  return useSWR(key, fetcher, {
    initialData,
    ...config,
  })
}

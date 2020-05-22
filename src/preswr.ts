import React from "react"
import useSWR, { keyInterface, responseInterface } from "swr"
import { useConfigContext } from "./config-context"
import { defaultFetcher } from "./default-fetcher"
import { usePreloaderContext } from "./preloader-context"
import { ConfigInterface, Fetcher, Serializable } from "./types"
import { normalizeKey } from "./util"

declare function _usePreSWR<Data extends Serializable = any, Err = any>(
  key: keyInterface
): responseInterface<Data, Err>
declare function _usePreSWR<Data = any, Err = any>(
  key: keyInterface,
  config?: ConfigInterface
): responseInterface<Data, Err>
declare function _usePreSWR<Data extends Serializable = any, Err = any>(
  key: keyInterface,
  fetcher?: Fetcher<Data>,
  config?: ConfigInterface
): responseInterface<Data, Err>

export const usePreSWR: typeof _usePreSWR = <
  Data extends Serializable = any,
  Err = any
>(
  key: keyInterface,
  fetcherOrConfig?: Fetcher<Data> | ConfigInterface<Data, Err>,
  maybeConfig?: ConfigInterface
): responseInterface<Data, Err> => {
  const data = usePreloaderContext()

  const [initialData] = React.useState(() => {
    const normalizedKey = normalizeKey(key)
    const stringKey = JSON.stringify(normalizedKey)
    return data.memory[stringKey]
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

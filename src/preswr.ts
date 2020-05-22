import React from "react"
import useSWR, {
  ConfigInterface as SWRConfigInterface,
  keyInterface,
  responseInterface,
} from "swr"
import { usePreloaderContext } from "./preloader-context"
import { Fetcher } from "./types"
import { normalizeKey } from "./util"

export type ConfigInterface<Data = any, Err = any> = SWRConfigInterface<
  Data,
  Err,
  any
> & { fetcher?: undefined }

export const usePreSWR = <Data = any, Err = any>(
  key: keyInterface,
  fetcher: Fetcher<Data>,
  config?: ConfigInterface
): responseInterface<Data, Err> => {
  const data = usePreloaderContext()
  const normalizedKey = normalizeKey(key)
  const initialData = React.useMemo(
    () => data.memory[JSON.stringify(normalizedKey)],
    normalizedKey ?? []
  )

  if (data.isCollecting) {
    if (normalizedKey != null) {
      const stringKey = JSON.stringify(normalizedKey)
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
    fetcher: undefined,
  })
}

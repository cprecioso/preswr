import { keyInterface } from "swr"

export type AlwaysArray<T> = T extends any[] ? T : [T]

export const normalizeKey = (key: keyInterface) => {
  if (typeof key === "function")
    try {
      key = key()
      if (!key) key = null
    } catch {
      key = null
    }

  if (key == null) return null

  if (!Array.isArray(key)) key = [key]

  return key
}

export const asyncMapValues = async <T, U>(
  record: Record<string, T>,
  fn: (v: T) => Promise<U>
) => {
  const newRecord: Record<string, U> = {}

  await Promise.all(
    Object.entries(record).map(async ([k, v]) => {
      newRecord[k] = await fn(v)
    })
  )

  return newRecord
}

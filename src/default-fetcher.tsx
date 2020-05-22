import { Fetcher } from "./types"

type FetchArgs = typeof fetch extends (...args: infer T) => any ? T : never

export const defaultFetcher: Fetcher<any> = async (...args: FetchArgs) =>
  await (await fetch(...args)).text()

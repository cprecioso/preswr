import React from "react"
import { InternalData } from "./types"

export const createPreloaderContext = (
  data: Partial<InternalData> = {}
): InternalData => ({ memory: {}, isCollecting: false, ...data })

const PreloaderContext = React.createContext<InternalData>(
  createPreloaderContext()
)

export const PreloaderProvider = PreloaderContext.Provider
export const usePreloaderContext = () => React.useContext(PreloaderContext)

import React from "react"
import { ConfigInterface } from "./preswr"

const ConfigContext = React.createContext<Partial<ConfigInterface>>({})

export const ConfigProvider = ConfigContext.Provider
export const useConfigContext = () => React.useContext(ConfigContext)

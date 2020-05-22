import React, { FunctionComponent } from "react"
import { SWRConfig } from "swr"
import { ConfigInterface } from "./types"

const ConfigContext = React.createContext<Partial<ConfigInterface>>({})

export const ConfigProvider: FunctionComponent<{
  value: Partial<ConfigInterface>
}> = ({ value, children }) => (
  <ConfigContext.Provider value={value}>
    <SWRConfig value={value}>{children}</SWRConfig>
  </ConfigContext.Provider>
)

export const useConfigContext = () => React.useContext(ConfigContext)

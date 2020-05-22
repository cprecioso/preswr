import React, { FunctionComponent } from "react"
import { SWRConfig } from "swr"
import { ConfigInterface } from "./types"

const ConfigContext = React.createContext<Partial<ConfigInterface>>({})

/**
 * Use this component to pass configuration to the swr and preswr hooks
 * used in its children component tree.
 *
 * @param value Configuration to pass to children
 */
export const ConfigProvider: FunctionComponent<{
  /**
   * Configuration to pass to children
   */
  value: Partial<ConfigInterface>
}> = ({ value, children }) => (
  <ConfigContext.Provider value={value}>
    <SWRConfig value={value}>{children}</SWRConfig>
  </ConfigContext.Provider>
)

export const useConfigContext = () => React.useContext(ConfigContext)

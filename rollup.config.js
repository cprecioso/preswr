// @ts-check

import ts from "@wessberg/rollup-plugin-ts"
import pkg from "./package.json"

const externalDeps = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
  ...require("module").builtinModules,
]

export default /** @type {import("rollup").RollupOptions} */ ({
  input: ["src/index.ts"],
  output: [
    { dir: "dist", format: "cjs", exports: "named" },
    { dir: "dist", format: "esm", entryFileNames: "[name].mjs" },
  ],
  plugins: [ts({ typescript: require("typescript") })],
  external: (id) =>
    externalDeps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
})

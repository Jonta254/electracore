import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  { rules: {
    "react-hooks/set-state-in-effect": "off", // Legacy localStorage hydration; preserve schema and behavior.
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": "off",
  } },
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts"]),
]);

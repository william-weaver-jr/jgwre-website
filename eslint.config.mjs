import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * `next lint` is deprecated and, with no config file present, dropped into an
 * interactive setup prompt — which meant `npm run lint` could never run
 * unattended. This is the flat config it was asking for; the script now calls
 * the ESLint CLI directly.
 *
 * `eslint-config-next` ships native flat configs as of v16, so they are spread
 * in directly. The FlatCompat wrapper this replaces was for the eslintrc-style
 * configs v15 shipped, and v16's own configs crash it — do not reintroduce it.
 */
const config = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "coverage/**"],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // CLAUDE.md §4: no `any`.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // Tests reach into internals and stub modules on purpose.
    files: ["**/*.test.ts", "**/*.test.tsx", "tests/**"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
];

export default config;

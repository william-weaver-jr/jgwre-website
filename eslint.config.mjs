import { FlatCompat } from "@eslint/eslintrc";

/**
 * `next lint` is deprecated and, with no config file present, dropped into an
 * interactive setup prompt — which meant `npm run lint` could never run
 * unattended. This is the flat config it was asking for; the script now calls
 * the ESLint CLI directly.
 *
 * `eslint-config-next` still ships eslintrc-style configs, so it is loaded
 * through FlatCompat.
 */
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "coverage/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
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

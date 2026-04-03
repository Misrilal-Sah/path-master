# Tech Stack

**Analysis Date:** 2026-04-03

## Runtime

- **VS Code Extension Host** — the extension runs inside VS Code's Node.js-based extension host process
- **Minimum VS Code version:** `^1.75.0` (declared in `package.json` `engines.vscode`)
- Compiled output entry point: `out/extension.js` (CommonJS module)

## Language

- **TypeScript 5.x** (`typescript ^5.0.0` in devDependencies)
- Compiler target: `ES2020`
- Module system: `commonjs`
- Strict mode: enabled (`"strict": true` in `tsconfig.json`)
- Source root: `.` (rootDir), output: `out/` (outDir)
- Config: `tsconfig.json`

## Build

- **Compiler:** `tsc` (TypeScript compiler) — no bundler (webpack/esbuild/rollup not used)
- Build command: `npm run compile` → `tsc -p ./`
- Watch mode: `npm run watch` → `tsc -watch -p ./`
- Publish pre-step: `npm run vscode:prepublish` → `npm run compile`
- Source maps: enabled (`"sourceMap": true`)
- Linting: ESLint with `@typescript-eslint/eslint-plugin ^6.0.0` and `@typescript-eslint/parser ^6.0.0`
  - Lint command: `npm run lint` → `eslint . --ext .ts`

## Test Framework

- **Node.js built-in test runner** (`node:test`) — no third-party test framework
- **Assertion library:** `node:assert/strict` (built-in)
- Test files: `test/pathUtils.test.ts` compiled to `out/test/pathUtils.test.js`
- Test command: `npm test` → `npm run compile` then `node --test out/test`
- No coverage tooling configured

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| *(none)* | — | No runtime `dependencies` block — the extension has zero npm runtime dependencies |

All runtime behavior is implemented via the VS Code extension host API (provided by VS Code itself) and Node.js built-in modules (`path`).

## Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | `^5.0.0` | TypeScript compiler |
| `@types/vscode` | `^1.75.0` | VS Code API type definitions |
| `@types/node` | `^18.0.0` | Node.js built-in type definitions |
| `eslint` | `^8.0.0` | Linting |
| `@typescript-eslint/eslint-plugin` | `^6.0.0` | TypeScript ESLint rules |
| `@typescript-eslint/parser` | `^6.0.0` | TypeScript parser for ESLint |

---

*Stack analysis: 2026-04-03*

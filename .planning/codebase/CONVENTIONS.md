# Coding Conventions

**Analysis Date:** 2026-04-03

## Naming

**Files:**
- `camelCase.ts` — e.g., `pathUtils.ts`, `extension.ts`
- Test files mirror their source counterpart: `pathUtils.test.ts` tests `pathUtils.ts`

**Functions:**
- `camelCase` — e.g., `applyPathSeparator`, `formatPaths`, `getConfig`, `convertPathSeparator`, `getFileUris`, `showCopyNotification`, `copyToClipboard`

**Types / Interfaces:**
- `PascalCase` — e.g., `PathSeparatorMode`, `MultiFileFormat`, `Config`
- Union string literal types for enums (no `enum` keyword used): `'auto' | 'forward' | 'backward'`

**Variables / Parameters:**
- `camelCase` — e.g., `filePath`, `workspaceUri`, `notificationDuration`

## Code Style

**Linting:**
- Tool: ESLint `^8.0.0` with `@typescript-eslint/recommended`
- Config: `.eslintrc.json` at project root
- Key rules enforced (warn-level):
  - `semi` — semicolons required
  - `curly` — braces required on all control structures
  - `eqeqeq` — strict equality (`===`) required
  - `no-throw-literal` — must throw `Error` instances, not plain literals
  - `@typescript-eslint/naming-convention` — imports must be `camelCase` or `PascalCase`

**Formatting:**
- No Prettier detected — formatting is governed by ESLint rules only

**Indentation:**
- 2 spaces (observed throughout `extension.ts` and `src/pathUtils.ts`)

**Section Dividers:**
- Long `// ---` banner comments group logical sections in `extension.ts`:
  ```typescript
  // ---------------------------------------------------------------------------
  // Configuration helpers
  // ---------------------------------------------------------------------------
  ```

**Inline Comments:**
- Inline comments explain non-obvious branching (e.g., priority order in `getFileUris`)

## TypeScript Config

From `tsconfig.json`:

| Option | Value | Effect |
|--------|-------|--------|
| `target` | `ES2020` | Compiled output targets ES2020 |
| `module` | `commonjs` | Output uses `require`/`module.exports` |
| `strict` | `true` | All strict checks enabled (`strictNullChecks`, `noImplicitAny`, etc.) |
| `esModuleInterop` | `true` | Allows `import x from 'x'` for CJS modules |
| `skipLibCheck` | `true` | Skips type-checking `.d.ts` in `node_modules` |
| `forceConsistentCasingInFileNames` | `true` | Case-sensitive import paths enforced |
| `resolveJsonModule` | `true` | JSON files can be imported |
| `sourceMap` | `true` | `.map` files emitted alongside `.js` |
| `rootDir` | `.` | Covers root, `src/`, and `test/` |
| `outDir` | `out` | All compiled output goes to `out/` |

## Export Patterns

- **Named exports only** — no default exports anywhere
- Pure utilities in `src/pathUtils.ts` export types and functions directly:
  ```typescript
  export type PathSeparatorMode = 'auto' | 'forward' | 'backward';
  export function applyPathSeparator(...): string { ... }
  ```
- `extension.ts` exports the VS Code lifecycle hooks as named exports:
  ```typescript
  export function activate(context: vscode.ExtensionContext): void { ... }
  export function deactivate(): void { ... }
  ```
- No barrel (`index.ts`) files — consumers import directly from the source file

## Error Handling

- **No `try/catch` blocks** — all code paths are considered safe (no I/O, no network)
- User-facing errors surfaced via `vscode.window.showErrorMessage()`:
  ```typescript
  vscode.window.showErrorMessage('Path Master: No file selected.');
  ```
- **Guard-clause / early-return pattern** for validation at command entry:
  ```typescript
  if (targets.length === 0) {
    vscode.window.showErrorMessage('...');
    return;
  }
  ```
- Pure utility functions (`applyPathSeparator`, `formatPaths`) use `switch` with `default` fallback — never throw
- No custom `Error` subclasses defined

## File Organization

```
path-master/
├── extension.ts          # VS Code extension entry point (activate/deactivate)
├── src/
│   └── pathUtils.ts      # Pure utility functions (no VS Code API)
├── test/
│   └── pathUtils.test.ts # Node built-in test runner tests
├── out/                  # Compiled JS output (gitignored, generated)
├── package.json
├── tsconfig.json
└── .eslintrc.json
```

**Where to add new code:**
- New pure/testable logic → `src/pathUtils.ts` (or a new file under `src/`)
- New VS Code commands → `extension.ts` (`activate` function, following existing `// ── N.` section pattern)
- New tests for utilities → `test/pathUtils.test.ts`
- VS Code API-dependent helpers → `extension.ts` private functions (not exported)

---

*Convention analysis: 2026-04-03*

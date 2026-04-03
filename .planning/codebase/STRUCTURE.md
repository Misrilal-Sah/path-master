# Structure

**Analysis Date:** 2026-04-03

## Directory Layout

```
path-master/                   # Workspace root
├── extension.ts               # Extension entry point (source)
├── package.json               # Extension manifest — commands, menus, keybindings, settings
├── tsconfig.json              # TypeScript compiler configuration
├── launch.json                # VS Code debug launch configuration
├── tasks.json                 # VS Code task definitions (compile)
├── CHANGELOG.md               # Version history
├── README.md                  # User-facing documentation
├── run.md                     # Developer notes / run instructions
├── proj1.txt                  # Scratch / notes file
├── src/
│   └── pathUtils.ts           # Pure path-formatting utility functions (no VS Code dep)
├── test/
│   └── pathUtils.test.ts      # Unit tests for src/pathUtils.ts (Node built-in test runner)
└── out/                       # Compiled JS output (generated, not committed)
    ├── extension.js           # Compiled entry point (referenced by "main" in package.json)
    ├── src/
    │   └── pathUtils.js       # Compiled utility module
    └── test/
        └── pathUtils.test.js  # Compiled tests
```

## File Purposes

**`extension.ts`**
- The VS Code extension entry point.
- Exports `activate()` and `deactivate()`.
- Registers all 6 commands inside `activate()` via `context.subscriptions.push(vscode.commands.registerCommand(...))`.
- Contains all VS Code API usage: `vscode.workspace`, `vscode.window`, `vscode.env.clipboard`, `vscode.Uri`.
- Imports pure helpers from `./src/pathUtils`.

**`src/pathUtils.ts`**
- Stateless, pure utility functions with no VS Code imports.
- Exports: `applyPathSeparator`, `formatPaths`, `PathSeparatorMode`, `MultiFileFormat`.
- Kept separate to enable unit testing without a VS Code host process.

**`test/pathUtils.test.ts`**
- Unit tests using Node's built-in `node:test` and `node:assert/strict`.
- Tests only `src/pathUtils.ts` (pure functions only; extension.ts is not tested here).
- 6 test cases covering all modes of `applyPathSeparator` and `formatPaths`.

**`package.json`**
- VS Code extension manifest.
- Declares `"main": "./out/extension.js"`.
- Contributes: 6 commands, 1 submenu, menus for `explorer/context`, `editor/title/context`, `editor/context`, and `commandPalette`.
- Defines 3 keybindings (`Ctrl+Alt+C F/R/P`).
- Declares 4 configuration properties under `pathMaster.*`.

**`tsconfig.json`**
- Compile `extension.ts` and `src/*.ts` and `test/*.ts` into `out/` with source maps.

**`launch.json`**
- Debug configuration for running the extension in the Extension Development Host.

**`tasks.json`**
- Build task (`tsc -watch` or similar) for incremental compilation during development.

## Entry Points

**VS Code activation:**
- `out/extension.js` → `activate(context)` — called by VS Code when any `path-master.*` command is first invoked.

**Test runner:**
- `node --test out/test` (or `out/test/pathUtils.test.js`) — run after compiling with `tsc`.

## Module Boundaries

**Integration layer** (`extension.ts`):
- May import from: `vscode`, `path` (Node built-in), `./src/pathUtils`.
- Must NOT be imported by: `src/pathUtils.ts` or `test/`.

**Pure logic layer** (`src/pathUtils.ts`):
- May import from: nothing (zero dependencies).
- May be imported by: `extension.ts`, `test/pathUtils.test.ts`.
- Rule: never introduce a `vscode` import here — it breaks unit testability.

**Tests** (`test/`):
- May import from: `node:test`, `node:assert/strict`, `../src/pathUtils`.
- Must NOT import from: `extension.ts` or `vscode`.

## Where to Add New Code

**New command:**
1. Declare under `contributes.commands` and desired `menus` in `package.json`.
2. Register handler in `activate()` in `extension.ts` — follow the existing `context.subscriptions.push(vscode.commands.registerCommand(...))` pattern.

**New path-formatting logic:**
- Add pure function to `src/pathUtils.ts` and export it.
- Add corresponding unit test cases to `test/pathUtils.test.ts`.
- Wire into `extension.ts` via a thin wrapper if config-aware behavior is needed.

**New configuration property:**
- Declare under `contributes.configuration.properties` in `package.json`.
- Add field to the `Config` interface in `extension.ts`.
- Read it inside `getConfig()`.

**Assets (icon, images):**
- Place in `assets/` (e.g., `assets/icon.png` is already referenced in `package.json`).

---

*Structure analysis: 2026-04-03*

# Architecture

**Analysis Date:** 2026-04-03

## Style

**Overall pattern:** VS Code Extension — thin integration shell over a pure-logic utility module.

The extension follows a two-layer design:
- **Integration layer** (`extension.ts`): owns all VS Code API calls, lifecycle hooks, and command registration. No business logic lives here.
- **Pure logic layer** (`src/pathUtils.ts`): stateless functions with zero VS Code dependency, designed for unit testability.

This separation means all path-transformation logic can be tested without a VS Code host.

## Entry Point

**`extension.ts`** (compiled to `out/extension.js`, declared as `"main"` in `package.json`):
- Exports `activate(context: vscode.ExtensionContext): void` — called by VS Code when the extension loads.
- Exports `deactivate(): void` — called on unload (logs only; no cleanup needed).
- `activationEvents` is `[]`, meaning VS Code activates on first command invocation.

## Command Registration Flow

All six commands are registered inside `activate()` using the same pattern:

```
context.subscriptions.push(
  vscode.commands.registerCommand('path-master.<id>', async (uri?, uris?) => {
    ...
  })
)
```

**Registration order in `activate()`:**
1. `path-master.copyFileName` — basename with extension
2. `path-master.copyFileNameNoExt` — basename stripped of extension
3. `path-master.copyRelativePath` — workspace-relative path, separator-aware
4. `path-master.copyFullPath` — absolute filesystem path, separator-aware
5. `path-master.copyRelativePathUnix` — relative path forced to `/` (Windows only via `when: isWindows`)
6. `path-master.copyFullPathUnix` — absolute path forced to `/` (Windows only via `when: isWindows`)

Adding a new command means: (a) declare it in `package.json` under `contributes.commands`, add it to the desired `menus`, then (b) register it in `activate()`.

## Module Responsibilities

**`extension.ts`**
- `activate()` / `deactivate()` — VS Code extension lifecycle
- `getConfig(): Config` — reads `pathMaster.*` workspace settings into a typed struct; called fresh on every command invocation (no caching)
- `convertPathSeparator(filePath)` — thin wrapper: reads `defaultPathSeparator` from config, delegates to `applyPathSeparator`
- `formatMultiplePaths(paths[])` — thin wrapper: reads `copyMultipleFilesFormat` from config, delegates to `formatPaths`
- `getFileUris(uri?, uris?)` — URI resolution with three-level fallback: multi-select array → single Explorer/tab URI → active editor URI
- `getWorkspaceFolder(fileUri)` — returns the containing workspace folder URI (used for relative-path computation)
- `showCopyNotification(text, count)` — fires `showInformationMessage` toast and sets status bar message; respects `showNotifications` and `notificationDuration` settings
- `copyToClipboard(text, count)` — writes to `vscode.env.clipboard`, then calls `showCopyNotification`

**`src/pathUtils.ts`**
- `applyPathSeparator(filePath, mode: PathSeparatorMode)` — pure: converts `\`↔`/` or returns unchanged for `'auto'`
- `formatPaths(paths[], format: MultiFileFormat)` — pure: joins paths as newline / comma / JSON array
- Exports `PathSeparatorMode` and `MultiFileFormat` type aliases consumed by `extension.ts`

## Data Flow

**Single-file copy (e.g., Copy Full Path):**

```
VS Code fires command
  → getFileUris(uri, uris)         resolve 1–N target URIs
  → u.fsPath                       extract OS filesystem path string
  → convertPathSeparator(fsPath)   apply separator preference (via applyPathSeparator)
  → formatMultiplePaths([path])    format for clipboard (via formatPaths) — single item is a no-op join
  → copyToClipboard(result, 1)     write to clipboard + notify
```

**Multi-file copy (Explorer multi-select):**

```
VS Code fires command with uris[]
  → getFileUris(uri, uris)         returns all selected URIs
  → map over targets               compute each path string
  → formatMultiplePaths(paths[])   join with newline / comma / array per setting
  → copyToClipboard(result, N)     write combined string + notify "Copied N paths"
```

**Relative-path variant (adds workspace resolution):**

```
...same as above up to target URI...
  → getWorkspaceFolder(u)          find containing workspace folder URI
  → path.relative(root, fsPath)   compute relative portion
  → convertPathSeparator(rel)      apply separator preference
  → ...continues as above...
```

## Key Design Decisions

- **No caching of config**: `getConfig()` is called on every command invocation so settings changes take effect immediately without reloading the extension.
- **Pure utility extraction**: `applyPathSeparator` and `formatPaths` are in `src/pathUtils.ts` with no VS Code imports, making them trivially testable with Node's built-in test runner.
- **Subscription disposal**: every `registerCommand` return value is pushed into `context.subscriptions`, ensuring VS Code disposes all command registrations on deactivation.
- **Unix-format commands are additive**: `copyRelativePathUnix` / `copyFullPathUnix` bypass the user's separator setting and hardcode `/`, exposed only when `isWindows` is true — no branching inside the main path commands.

---

*Architecture analysis: 2026-04-03*

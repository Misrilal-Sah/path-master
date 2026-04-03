# Integrations

**Analysis Date:** 2026-04-03

## VS Code API

All VS Code API usage is in `extension.ts` via `import * as vscode from 'vscode'`.

**Commands:**
- `vscode.commands.registerCommand(id, handler)` — registers all 6 path-copy commands
- All registrations are pushed to `context.subscriptions` for automatic disposal on deactivation

**Registered command IDs:**
- `path-master.copyFileName`
- `path-master.copyFileNameNoExt`
- `path-master.copyRelativePath`
- `path-master.copyFullPath`
- `path-master.copyRelativePathUnix`
- `path-master.copyFullPathUnix`

**Configuration:**
- `vscode.workspace.getConfiguration('pathMaster')` — reads extension settings
- Settings consumed:
  - `pathMaster.showNotifications` (boolean, default `true`)
  - `pathMaster.notificationDuration` (number ms, default `3000`)
  - `pathMaster.defaultPathSeparator` (`'auto' | 'forward' | 'backward'`, default `'auto'`)
  - `pathMaster.copyMultipleFilesFormat` (`'newline' | 'comma' | 'array'`, default `'newline'`)

**Workspace:**
- `vscode.workspace.getWorkspaceFolder(uri)` — resolves the workspace root for relative path calculation

**Clipboard:**
- `vscode.env.clipboard.writeText(text)` — writes formatted paths to the system clipboard (async)

**UI / Notifications:**
- `vscode.window.showInformationMessage(msg)` — success toast after copying
- `vscode.window.showErrorMessage(msg)` — error toast when no file is selected or file is outside workspace
- `vscode.window.setStatusBarMessage(msg, duration)` — temporary status bar feedback with `$(clippy)` icon

**Editor / URI resolution:**
- `vscode.window.activeTextEditor?.document.uri` — fallback URI when no context menu URI is provided
- `vscode.Uri` — used as parameter and return types throughout

## External APIs / Services

None. The extension makes no network requests and uses no external APIs or cloud services.

## File System

No direct `fs` module usage. File system interaction is exclusively through VS Code URIs and Node.js `path`:

- `import * as path from 'path'` in `extension.ts`
  - `path.basename(u.fsPath)` — extracts file name from URI
  - `path.extname(u.fsPath)` — extracts extension for "no extension" variant
  - `path.relative(workspaceFsPath, fileFsPath)` — computes relative path from workspace root
- `vscode.Uri.fsPath` — converts a VS Code URI to a platform file system path string
- Path separator manipulation in `src/pathUtils.ts`:
  - `applyPathSeparator(filePath, mode)` — replaces `\` ↔ `/` based on mode
  - Direct regex `.replace(/\\/g, '/')` in Unix-force commands

## Configuration & Manifests

**`package.json`** serves as the VS Code extension manifest with the following contributions:

| Contribution Point | Details |
|---|---|
| `contributes.commands` | 6 commands with display titles and `Path Master` category |
| `contributes.submenus` | `path-master.submenu` — groups all commands under a `📋 Path Master` submenu |
| `contributes.menus` | Submenu injected into `explorer/context`, `editor/title/context`, `editor/context` |
| `contributes.menus.commandPalette` | All 6 commands exposed to Command Palette |
| `contributes.keybindings` | 3 keyboard shortcuts: `Ctrl+Alt+C F`, `Ctrl+Alt+C R`, `Ctrl+Alt+C P` (with Mac variants) |
| `contributes.configuration` | `pathMaster.*` settings block with 4 user-configurable properties |
| `activationEvents` | Empty array — uses implicit activation via command contribution |
| `main` | `./out/extension.js` — compiled entry point |

**Conditional menu visibility:**
- Unix-format path commands (`copyRelativePathUnix`, `copyFullPathUnix`) use `"when": "isWindows"` — only visible in the Explorer/editor menus on Windows.

---

*Integration audit: 2026-04-03*

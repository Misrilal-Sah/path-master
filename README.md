<p align="center">
  <img src="assets/icon.png" alt="Path Master Logo" width="128" height="128" />
</p>

<h1 align="center">Path Master — Copy File Paths</h1>

<p align="center">
  <strong>Stop hunting for file paths. Copy them instantly from anywhere.</strong>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=my-publisher-name.path-master">
    <img src="https://img.shields.io/visual-studio-marketplace/v/my-publisher-name.path-master?style=flat-square&color=1e1e1e&labelColor=007ACC&label=marketplace" alt="Version" />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=my-publisher-name.path-master">
    <img src="https://img.shields.io/visual-studio-marketplace/i/my-publisher-name.path-master?style=flat-square&color=1e1e1e&labelColor=007ACC&label=installs" alt="Installs" />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=my-publisher-name.path-master">
    <img src="https://img.shields.io/visual-studio-marketplace/r/my-publisher-name.path-master?style=flat-square&color=1e1e1e&labelColor=007ACC&label=rating" alt="Rating" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-1e1e1e?style=flat-square&labelColor=007ACC" alt="MIT License" />
  </a>
</p>

---

## What It Does

Path Master adds **6 path-copy commands** to VS Code — reachable from the right-click menu, keyboard shortcuts, and the Command Palette — with full multi-file and cross-platform support.

```
Right-click any file  →  📋 Path Master  →  done.
```

---

## Commands & Shortcuts

| Command | What You Get | Windows | macOS |
|---|---|---|---|
| 📄 **Copy File Name** | `app.ts` | `Ctrl+Alt+N` | `Cmd+Alt+N` |
| 📝 **Copy File Name (No Ext)** | `app` | `Ctrl+Alt+X` | `Cmd+Alt+X` |
| 📂 **Copy Relative Path** | `src/components/app.ts` | `Ctrl+Alt+R` | `Cmd+Alt+R` |
| 🐧 **Copy Relative Path (Unix)** | `src/components/app.ts` *(Windows → `/`)* | `Ctrl+Shift+Alt+R` | `Cmd+Shift+Alt+R` |
| 🗂️ **Copy Full Path** | `C:\Users\dev\project\src\app.ts` | `Ctrl+Alt+F` | `Cmd+Alt+F` |
| 🐧 **Copy Full Path (Unix)** | `C:/Users/dev/project/src/app.ts` *(Windows → `/`)* | `Ctrl+Shift+Alt+F` | `Cmd+Shift+Alt+F` |

> Shortcuts work when the editor **or** Explorer sidebar is focused.  
> Reassign any shortcut: `Ctrl+K, Ctrl+S` → search the command name → click ✏️.

---

## Four Ways to Access Commands

### 1 — Right-click menu (Explorer, editor tab, or inside the editor)

```
📋 Path Master
 ├── 📄 Copy File Name              Ctrl+Alt+N
 ├── 📝 Copy File Name (No Ext)     Ctrl+Alt+X
 ├── 📂 Copy Relative Path          Ctrl+Alt+R
 ├── 🐧 Copy Relative Path (Unix)   Ctrl+Shift+Alt+R
 ├── 🗂️  Copy Full Path              Ctrl+Alt+F
 └── 🐧 Copy Full Path (Unix)       Ctrl+Shift+Alt+F
```

### 2 — Keyboard shortcuts

Press any shortcut from the table above while the editor or Explorer is focused.

### 3 — Command Palette

`Ctrl+Shift+P` → type `Path Master` → pick a command.

### 4 — Multi-file selection

Hold `Ctrl` (or `Cmd` on macOS), click multiple files in Explorer, then right-click → **Path Master**. All paths are copied at once in your configured format.

---

## Multi-file Output Formats

Given three files selected: `src/app.ts`, `src/index.ts`, `src/utils.ts`

<table>
<tr>
<th><code>"newline"</code> (default)</th>
<th><code>"comma"</code></th>
<th><code>"array"</code></th>
</tr>
<tr>
<td>

```
src/app.ts
src/index.ts
src/utils.ts
```

</td>
<td>

```
src/app.ts, src/index.ts, src/utils.ts
```

</td>
<td>

```json
[
  "src/app.ts",
  "src/index.ts",
  "src/utils.ts"
]
```

</td>
</tr>
</table>

---

## Settings

Open `Settings` (`Ctrl+,`) and search **Path Master**, or add to `settings.json`:

```jsonc
{
  // Show a notification toast after copying
  "pathMaster.showNotifications": true,

  // How long the status bar message stays (milliseconds)
  "pathMaster.notificationDuration": 3000,

  // Separator: "auto" (OS default) | "forward" (/) | "backward" (\)
  "pathMaster.defaultPathSeparator": "auto",

  // Multi-file format: "newline" | "comma" | "array"
  "pathMaster.copyMultipleFilesFormat": "newline"
}
```

---

## Why Path Master?

| Feature | Path Master | Built-in VS Code | Other Extensions |
|---|---|---|---|
| Copy file name | ✅ | ✅ | ✅ |
| Copy file name **without extension** | ✅ | ❌ | ⚠️ Some |
| Copy relative path | ✅ | ✅ | ✅ |
| Copy full path | ✅ | ✅ | ✅ |
| **Multi-file selection** | ✅ | ❌ | ⚠️ Some |
| **Unix/Windows path toggle** | ✅ | ❌ | ⚠️ Rare |
| **Configurable output format** | ✅ | ❌ | ❌ |
| Shortcuts for all 6 commands | ✅ | ⚠️ 1 only | ⚠️ Limited |
| Works from editor tabs | ✅ | ❌ | ⚠️ Some |
| Smart notification preview | ✅ | ❌ | ❌ |

---

## Installation

**From the Marketplace:**

1. Open VS Code
2. `Ctrl+P` → run: `ext install my-publisher-name.path-master`

**From the CLI:**

```bash
code --install-extension my-publisher-name.path-master
```

---

## Contributing

1. Fork the repository
2. `git checkout -b feature/my-feature`
3. Make your changes — run `npm run compile` to verify they build cleanly
4. `npm test` — ensure all tests pass
5. Open a Pull Request

---

## Issues & Feedback

Found a bug or have an idea? [Open an issue on GitHub](https://github.com/Misrilal-Sah/path-master/issues).

Please include: VS Code version · OS · steps to reproduce.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## License

MIT — see [LICENSE](LICENSE) for details.

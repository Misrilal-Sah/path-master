# 📋 Path Master — Copy File Paths Like a Pro

**Stop hunting for file paths. Copy them instantly from anywhere.**

[![Version](https://img.shields.io/visual-studio-marketplace/v/my-publisher-name.path-master?style=flat-square&color=2D2D30&labelColor=007ACC&label=version)](https://marketplace.visualstudio.com/items?itemName=my-publisher-name.path-master)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/my-publisher-name.path-master?style=flat-square&color=2D2D30&labelColor=007ACC&label=installs)](https://marketplace.visualstudio.com/items?itemName=my-publisher-name.path-master)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/my-publisher-name.path-master?style=flat-square&color=2D2D30&labelColor=007ACC&label=rating)](https://marketplace.visualstudio.com/items?itemName=my-publisher-name.path-master)
[![License: MIT](https://img.shields.io/badge/license-MIT-007ACC?style=flat-square&color=2D2D30&labelColor=007ACC)](LICENSE)

Path Master adds six path-copy commands to VS Code, accessible from the Explorer, editor tabs, right-click menus, the Command Palette, and keyboard shortcuts — all with multi-file support and configurable formatting.

---

## Features

| Command | Description | Shortcut |
|---|---|---|
| 📄 Copy File Name | `app.ts` | `Ctrl+Alt+C F` |
| 📝 Copy File Name (No Extension) | `app` | — |
| 📂 Copy Relative Path | `src/components/app.ts` | `Ctrl+Alt+C R` |
| 🗂️ Copy Full Path | `/home/user/project/src/app.ts` | `Ctrl+Alt+C P` |
| 🐧 Copy Relative Path (Unix) | `src/components/app.ts` (Windows → forward slash) | — |
| 🐧 Copy Full Path (Unix) | `C:/Users/dev/project/src/app.ts` (Windows → forward slash) | — |

---

## Key Advantages

✅ **Multi-file selection** — select 10 files in Explorer and copy all paths at once  
✅ **Works everywhere** — Explorer, editor text, editor tabs, Command Palette  
✅ **Smart notifications** — preview of what was copied, dismissible via settings  
✅ **Cross-platform path formatting** — auto, forward slash, or backslash  
✅ **Configurable multi-file format** — one per line, comma-separated, or JSON array  
✅ **Keyboard shortcuts** — three bindings for the most-used commands  

---

## Screenshots

> **Screenshot 1:** Explorer right-click → `📋 Path Master` submenu  
> *(place `assets/screenshot-explorer.png` here)*

> **Screenshot 2:** Multi-file selection with JSON array output  
> *(place `assets/screenshot-multi.png` here)*

> **Screenshot 3:** Status bar notification after copy  
> *(place `assets/screenshot-notification.png` here)*

---

## Demo

> *(place `assets/demo.gif` here — record with VS Code's screen recorder)*

---

## Installation

**From the VS Code Marketplace:**

1. Open VS Code
2. Press `Ctrl+P` and run: `ext install my-publisher-name.path-master`

**From the CLI:**

```bash
code --install-extension my-publisher-name.path-master
```

---

## Usage

### Method 1 — Right-click menu

Right-click any file in the **Explorer sidebar**, an **editor tab**, or inside the **editor text area** → `📋 Path Master` → choose your command.

The submenu is organized into three groups separated by dividers:
- **Name** — file name with/without extension
- **Relative** — path relative to workspace root
- **Full** — absolute file system path

### Method 2 — Command Palette

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS), type `Path Master`, and select any command.

### Method 3 — Keyboard shortcuts

| Action | Windows / Linux | macOS |
|---|---|---|
| Copy File Name | `Ctrl+Alt+C F` | `Cmd+Alt+C F` |
| Copy Relative Path | `Ctrl+Alt+C R` | `Cmd+Alt+C R` |
| Copy Full Path | `Ctrl+Alt+C P` | `Cmd+Alt+C P` |

Shortcuts work when the cursor is in the editor **or** when the Explorer sidebar is focused.

### Method 4 — Multi-file selection

1. Hold `Ctrl` (or `Cmd` on macOS) and click multiple files in the Explorer.
2. Right-click any of the selected files → `📋 Path Master` → choose a command.
3. All selected paths are copied in your chosen format (see settings below).

---

## Settings

```json
{
  // Show a notification toast after copying
  "pathMaster.showNotifications": true,

  // How long the status bar message stays visible (milliseconds)
  "pathMaster.notificationDuration": 3000,

  // Path separator: "auto" (OS default) | "forward" (/) | "backward" (\)
  "pathMaster.defaultPathSeparator": "auto",

  // Multi-file output format: "newline" | "comma" | "array"
  "pathMaster.copyMultipleFilesFormat": "newline"
}
```

### Multi-file format examples

Given three selected files: `src/app.ts`, `src/index.ts`, `src/utils.ts`

**`"newline"` (default):**
```
src/app.ts
src/index.ts
src/utils.ts
```

**`"comma"`:**
```
src/app.ts, src/index.ts, src/utils.ts
```

**`"array"`:**
```json
[
  "src/app.ts",
  "src/index.ts",
  "src/utils.ts"
]
```

---

## Comparison

| Feature | Path Master | Built-in VS Code | Other Extensions |
|---|---|---|---|
| Copy file name | ✅ | ✅ | ✅ |
| Copy file name without extension | ✅ | ❌ | ⚠️ Some |
| Copy relative path | ✅ | ✅ | ✅ |
| Copy full path | ✅ | ✅ | ✅ |
| Multi-file selection | ✅ | ❌ | ⚠️ Some |
| Unix/Windows path toggle | ✅ | ❌ | ⚠️ Rare |
| Configurable output format | ✅ | ❌ | ❌ |
| Keyboard shortcuts | ✅ | ⚠️ Only 1 | ⚠️ Limited |
| Works from editor tabs | ✅ | ❌ | ⚠️ Some |
| Smart notification preview | ✅ | ❌ | ❌ |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request on GitHub

Please ensure the TypeScript compiles cleanly (`npm run compile`) before submitting.

---

## Issues & Feature Requests

Found a bug or have an idea? [Open an issue on GitHub](https://github.com/username/path-master/issues).

Please include:
- VS Code version
- Operating system
- Steps to reproduce (for bugs)

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Support

If Path Master saves you time:
- ⭐ Star the [GitHub repository](https://github.com/username/path-master)
- 📝 Leave a review on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=my-publisher-name.path-master)
- 🐛 [Report issues](https://github.com/username/path-master/issues) or suggest improvements

---

**Author:** Your Name · [GitHub](https://github.com/username) · [Twitter/X](https://twitter.com/username) · [Marketplace](https://marketplace.visualstudio.com/publishers/my-publisher-name)

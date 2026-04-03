# Changelog

All notable changes to **Path Master** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-04-15

### Added

#### Commands (6 total)
- `📄 Copy File Name` — copies the file's base name including extension (e.g. `app.ts`)
- `📝 Copy File Name (No Extension)` — copies the base name without the file extension (e.g. `app`)
- `📂 Copy Relative Path` — copies the path relative to the workspace root (e.g. `src/components/app.ts`)
- `🗂️ Copy Full Path` — copies the absolute file system path (e.g. `/home/user/project/src/app.ts`)
- `🐧 Copy Relative Path (Unix Format)` — relative path with forward-slash separators, shown on Windows only
- `🐧 Copy Full Path (Unix Format)` — absolute path with forward-slash separators, shown on Windows only

#### Multi-file Selection
- All commands support multi-file selection from the Explorer sidebar
- Copied text format is configurable: one per line, comma-separated, or JSON array

#### Context Menus (3 locations)
- `📋 Path Master` submenu in the Explorer right-click menu (`explorer/context`)
- `📋 Path Master` submenu in the editor tab right-click menu (`editor/title/context`)
- `📋 Path Master` submenu in the editor text right-click menu (`editor/context`)
- Submenu groups with visual separators between name, relative, and full-path commands

#### Keyboard Shortcuts (3 bindings — Windows/macOS)
- `Ctrl+Alt+C F` / `Cmd+Alt+C F` — Copy File Name
- `Ctrl+Alt+C R` / `Cmd+Alt+C R` — Copy Relative Path
- `Ctrl+Alt+C P` / `Cmd+Alt+C P` — Copy Full Path

#### Settings (4 options)
- `pathMaster.showNotifications` — toggle copy confirmation toasts
- `pathMaster.notificationDuration` — control how long status bar messages persist
- `pathMaster.defaultPathSeparator` — choose `auto`, `forward` (`/`), or `backward` (`\`)
- `pathMaster.copyMultipleFilesFormat` — `newline`, `comma`, or `array`

#### Cross-platform Support
- Works on Windows, macOS, and Linux
- Unix-format commands available on Windows for cross-platform workflows
- Path separator auto-converts based on setting

#### Notifications
- Information toast with path preview (truncated at 50 chars)
- Status bar message with `$(clippy)` icon for the configured duration
- All notifications can be silenced with `showNotifications: false`

---

[1.0.0]: https://github.com/username/path-master/releases/tag/v1.0.0

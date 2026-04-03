import * as vscode from 'vscode';
import * as path from 'path';
import { applyPathSeparator, formatPaths } from './src/pathUtils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Config {
  showNotifications: boolean;
  notificationDuration: number;
  defaultPathSeparator: 'auto' | 'forward' | 'backward';
  copyMultipleFilesFormat: 'newline' | 'comma' | 'array';
}

// ---------------------------------------------------------------------------
// Configuration helpers
// ---------------------------------------------------------------------------

/**
 * Reads all Path Master settings and returns a typed Config object.
 */
function getConfig(): Config {
  const cfg = vscode.workspace.getConfiguration('pathMaster');
  return {
    showNotifications:      cfg.get<boolean>('showNotifications', true),
    notificationDuration:   cfg.get<number>('notificationDuration', 3000),
    defaultPathSeparator:   cfg.get<'auto' | 'forward' | 'backward'>('defaultPathSeparator', 'auto'),
    copyMultipleFilesFormat: cfg.get<'newline' | 'comma' | 'array'>('copyMultipleFilesFormat', 'newline')
  };
}

// ---------------------------------------------------------------------------
// Path formatting helpers
// ---------------------------------------------------------------------------

/**
 * Converts path separators according to the user's `defaultPathSeparator` setting.
 * - "forward"  → always use `/`
 * - "backward" → always use `\`
 * - "auto"     → return the path unchanged (OS default)
 *
 * @param filePath - The raw path string to transform.
 */
function convertPathSeparator(filePath: string): string {
  const { defaultPathSeparator } = getConfig();
  return applyPathSeparator(filePath, defaultPathSeparator);
}

/**
 * Formats multiple paths into a single clipboard string.
 * The format is controlled by the `copyMultipleFilesFormat` setting:
 *   - "newline" → one path per line
 *   - "comma"   → comma-separated on one line
 *   - "array"   → pretty-printed JSON array
 *
 * @param paths - Array of path strings to format.
 */
function formatMultiplePaths(paths: string[]): string {
  const { copyMultipleFilesFormat } = getConfig();
  return formatPaths(paths, copyMultipleFilesFormat);
}

// ---------------------------------------------------------------------------
// URI resolution — multi-file support
// ---------------------------------------------------------------------------

/**
 * Resolves the list of URIs to operate on, with the following priority:
 *
 *   1. `uris` array (multi-select from the Explorer sidebar)
 *   2. Single `uri` (right-click on one file in Explorer or an editor tab)
 *   3. Active text editor document URI
 *   4. Empty array (caller must handle the "nothing to do" case)
 *
 * VS Code passes `uri` and `uris` automatically when a command is invoked
 * from the Explorer context menu or the editor tab context menu.
 *
 * @param uri  - Optional single URI from VS Code's menu context
 * @param uris - Optional multi-select URI array from VS Code's menu context
 */
function getFileUris(uri?: vscode.Uri, uris?: vscode.Uri[]): vscode.Uri[] {
  // Multi-select from Explorer: uris contains all selected items
  if (uris && uris.length > 0) {
    return uris;
  }

  // Single item from Explorer or an editor tab context
  if (uri) {
    return [uri];
  }

  // Fallback: use the currently active editor's document
  const activeUri = vscode.window.activeTextEditor?.document.uri;
  if (activeUri) {
    return [activeUri];
  }

  // Nothing found
  return [];
}

// ---------------------------------------------------------------------------
// Clipboard & notification
// ---------------------------------------------------------------------------

/**
 * Displays a notification after a successful clipboard write.
 * Respects the `showNotifications` and `notificationDuration` settings.
 *
 * @param text  - The text that was copied (used as the preview)
 * @param count - How many paths were copied (affects the message wording)
 */
function showCopyNotification(text: string, count = 1): void {
  const { showNotifications, notificationDuration } = getConfig();
  if (!showNotifications) { return; }

  let message: string;

  if (count > 1) {
    message = `Copied ${count} paths to clipboard`;
  } else {
    // Truncate long paths so the toast stays readable
    const preview = text.length > 50 ? text.substring(0, 47) + '...' : text;
    message = `Copied: ${preview}`;
  }

  vscode.window.showInformationMessage(message);
  vscode.window.setStatusBarMessage(`$(clippy) ${message}`, notificationDuration);
}

/**
 * Writes `text` to the system clipboard and shows a notification.
 *
 * @param text  - The text to write
 * @param count - Number of paths represented (for the notification wording)
 */
async function copyToClipboard(text: string, count = 1): Promise<void> {
  await vscode.env.clipboard.writeText(text);
  showCopyNotification(text, count);
}

// ---------------------------------------------------------------------------
// Workspace root resolution
// ---------------------------------------------------------------------------

/**
 * Returns the workspace folder URI that contains `fileUri`, or `undefined`
 * if the file is not inside any open workspace folder.
 *
 * @param fileUri - URI of the file to locate within the workspace
 */
function getWorkspaceFolder(fileUri: vscode.Uri): vscode.Uri | undefined {
  const folder = vscode.workspace.getWorkspaceFolder(fileUri);
  return folder?.uri;
}

// ---------------------------------------------------------------------------
// Activation
// ---------------------------------------------------------------------------

export function activate(context: vscode.ExtensionContext): void {
  console.log('[Path Master] Extension activated.');

  // ── 1. Copy File Name ────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'path-master.copyFileName',
      async (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
        const targets = getFileUris(uri, uris);
        if (targets.length === 0) {
          vscode.window.showErrorMessage('Path Master: No file selected.');
          return;
        }

        const names = targets.map(u => path.basename(u.fsPath));
        const result = formatMultiplePaths(names);
        await copyToClipboard(result, names.length);
      }
    )
  );

  // ── 2. Copy File Name (No Extension) ────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'path-master.copyFileNameNoExt',
      async (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
        const targets = getFileUris(uri, uris);
        if (targets.length === 0) {
          vscode.window.showErrorMessage('Path Master: No file selected.');
          return;
        }

        const names = targets.map(u =>
          path.basename(u.fsPath, path.extname(u.fsPath))
        );
        const result = formatMultiplePaths(names);
        await copyToClipboard(result, names.length);
      }
    )
  );

  // ── 3. Copy Relative Path ────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'path-master.copyRelativePath',
      async (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
        const targets = getFileUris(uri, uris);
        if (targets.length === 0) {
          vscode.window.showErrorMessage('Path Master: No file selected.');
          return;
        }

        const paths: string[] = [];
        const skipped: string[] = [];
        for (const u of targets) {
          const workspaceUri = getWorkspaceFolder(u);
          if (!workspaceUri) {
            skipped.push(path.basename(u.fsPath));
            continue;
          }
          const rel = path.relative(workspaceUri.fsPath, u.fsPath);
          paths.push(convertPathSeparator(rel));
        }

        if (skipped.length > 0) {
          vscode.window.showWarningMessage(
            `Path Master: ${skipped.length} file(s) skipped — not inside an open workspace folder: ${skipped.join(', ')}`
          );
        }
        if (paths.length === 0) { return; }

        const result = formatMultiplePaths(paths);
        await copyToClipboard(result, paths.length);
      }
    )
  );

  // ── 4. Copy Full Path ────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'path-master.copyFullPath',
      async (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
        const targets = getFileUris(uri, uris);
        if (targets.length === 0) {
          vscode.window.showErrorMessage('Path Master: No file selected.');
          return;
        }

        const paths = targets.map(u => convertPathSeparator(u.fsPath));
        const result = formatMultiplePaths(paths);
        await copyToClipboard(result, paths.length);
      }
    )
  );

  // ── 5. Copy Relative Path (Unix Format) ─────────────────────────────────
  // Always uses forward slashes regardless of the defaultPathSeparator setting.
  // Shown only on Windows (controlled via `when: isWindows` in menus).
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'path-master.copyRelativePathUnix',
      async (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
        const targets = getFileUris(uri, uris);
        if (targets.length === 0) {
          vscode.window.showErrorMessage('Path Master: No file selected.');
          return;
        }

        const paths: string[] = [];
        const skipped: string[] = [];
        for (const u of targets) {
          const workspaceUri = getWorkspaceFolder(u);
          if (!workspaceUri) {
            skipped.push(path.basename(u.fsPath));
            continue;
          }
          const rel = path.relative(workspaceUri.fsPath, u.fsPath);
          // Force Unix separators, regardless of user setting
          paths.push(rel.replace(/\\/g, '/'));
        }

        if (skipped.length > 0) {
          vscode.window.showWarningMessage(
            `Path Master: ${skipped.length} file(s) skipped — not inside an open workspace folder: ${skipped.join(', ')}`
          );
        }
        if (paths.length === 0) { return; }

        const result = formatMultiplePaths(paths);
        await copyToClipboard(result, paths.length);
      }
    )
  );

  // ── 6. Copy Full Path (Unix Format) ─────────────────────────────────────
  // Always uses forward slashes regardless of the defaultPathSeparator setting.
  // Shown only on Windows (controlled via `when: isWindows` in menus).
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'path-master.copyFullPathUnix',
      async (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
        const targets = getFileUris(uri, uris);
        if (targets.length === 0) {
          vscode.window.showErrorMessage('Path Master: No file selected.');
          return;
        }

        // Force Unix separators
        const paths = targets.map(u => u.fsPath.replace(/\\/g, '/'));
        const result = formatMultiplePaths(paths);
        await copyToClipboard(result, paths.length);
      }
    )
  );
}

// ---------------------------------------------------------------------------
// Deactivation
// ---------------------------------------------------------------------------

export function deactivate(): void {
  console.log('[Path Master] Extension deactivated.');
}

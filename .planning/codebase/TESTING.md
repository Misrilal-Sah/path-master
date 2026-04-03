# Testing Patterns

**Analysis Date:** 2026-04-03

## Framework

**Runner:**
- Node.js built-in test runner (`node:test`) — no external test framework installed
- Available in Node 18+ (devDependency `@types/node: ^18.0.0` confirms this)
- Config file: none — runner is invoked directly via CLI

**Assertion Library:**
- Node.js built-in `node:assert/strict` — strict equality mode throughout

**Run Commands:**
```bash
npm run test          # compile (tsc) then run node --test out/test
npm run compile       # tsc -p ./ (compile only)
node --test out/test  # run tests directly after manual compile
npm run lint          # eslint . --ext .ts
```

`pretest` hook in `package.json` automatically runs `npm run compile` before `npm run test`.

## Test File Organization

**Location:** Co-located with source hierarchy but under `test/`:
```
test/
└── pathUtils.test.ts   # tests for src/pathUtils.ts
```

**Naming:**
- `{moduleName}.test.ts` matches the source file it tests

**Compiled output:** `out/test/pathUtils.test.js` — this is what the runner executes

## Test Structure

**No `describe` blocks** — all tests are flat top-level `test()` calls:
```typescript
import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPathSeparator, formatPaths } from '../src/pathUtils';

test('applyPathSeparator keeps path unchanged in auto mode', () => {
  const input = 'src\\utils\\file.ts';
  assert.equal(applyPathSeparator(input, 'auto'), input);
});
```

**One assertion per test** — each test validates exactly one behavior.

**Import style:** Relative imports (`../src/pathUtils`) from compiled output path.

## What Is Tested

All tests live in `test/pathUtils.test.ts` (6 tests total):

**`applyPathSeparator` (3 tests):**
- `'auto'` mode returns path unchanged
- `'forward'` mode converts backslashes to forward slashes
- `'backward'` mode converts forward slashes to backslashes

**`formatPaths` (3 tests):**
- `'newline'` format joins with `\n`
- `'comma'` format joins with `', '`
- `'array'` format produces pretty-printed JSON (`JSON.stringify(paths, null, 2)`)

## What Is NOT Tested

**`extension.ts` is entirely untested** — VS Code API dependency (`vscode`) makes unit testing impractical without a mock runtime. Untested functions include:

- `activate()` — extension entry point
- `deactivate()` — extension teardown
- `getConfig()` — reads `vscode.workspace.getConfiguration`
- `convertPathSeparator()` — wraps `applyPathSeparator` + `getConfig`
- `formatMultiplePaths()` — wraps `formatPaths` + `getConfig`
- `getFileUris()` — resolves `vscode.Uri` targets with fallback to active editor
- `getWorkspaceFolder()` — resolves workspace root for a URI
- `showCopyNotification()` — VS Code info message + status bar
- `copyToClipboard()` — `vscode.env.clipboard.writeText`
- All 6 registered command handlers (copyFileName, copyFileNameNoExt, copyRelativePath, copyFullPath, copyRelativePathUnix, copyFullPathUnix)

**Edge cases not covered in utility tests:**
- `applyPathSeparator` with empty string input
- `applyPathSeparator` with already-normalized paths (no-op cases)
- `formatPaths` with empty array `[]`
- `formatPaths` with single-element array
- `formatPaths` with paths containing spaces or special characters

## Coverage Gaps

**High priority:**
- `getFileUris()` — fallback logic (multi-select → single → active editor → empty) is complex and untested
- `copyRelativePath` / `copyRelativePathUnix` commands — workspace folder resolution (`getWorkspaceFolder`) has an error branch that is never triggered in tests

**Medium priority:**
- `applyPathSeparator` edge cases (empty string, mixed separators)
- `formatPaths` edge cases (empty array, single item)

**Low priority / structural limitation:**
- `getConfig()` — requires VS Code API mock to test; no mock infrastructure exists
- All notification/clipboard behavior — requires VS Code test harness (`@vscode/test-electron` or similar)

**Coverage tooling:** None configured. No `--experimental-test-coverage` flag or c8/istanbul setup.

---

*Testing analysis: 2026-04-03*

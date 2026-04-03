import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPathSeparator, formatPaths } from '../src/pathUtils';

test('applyPathSeparator keeps path unchanged in auto mode', () => {
  const input = 'src\\utils\\file.ts';
  assert.equal(applyPathSeparator(input, 'auto'), input);
});

test('applyPathSeparator converts to forward slashes', () => {
  assert.equal(applyPathSeparator('src\\utils\\file.ts', 'forward'), 'src/utils/file.ts');
});

test('applyPathSeparator converts to backslashes', () => {
  assert.equal(applyPathSeparator('src/utils/file.ts', 'backward'), 'src\\utils\\file.ts');
});

test('formatPaths newline format', () => {
  assert.equal(formatPaths(['a.ts', 'b.ts'], 'newline'), 'a.ts\nb.ts');
});

test('formatPaths comma format', () => {
  assert.equal(formatPaths(['a.ts', 'b.ts'], 'comma'), 'a.ts, b.ts');
});

test('formatPaths array format', () => {
  assert.equal(formatPaths(['a.ts', 'b.ts'], 'array'), '[\n  "a.ts",\n  "b.ts"\n]');
});

export type PathSeparatorMode = 'auto' | 'forward' | 'backward';
export type MultiFileFormat = 'newline' | 'comma' | 'array';

/**
 * Pure helper for converting path separators.
 */
export function applyPathSeparator(filePath: string, mode: PathSeparatorMode): string {
  switch (mode) {
    case 'forward':
      return filePath.replace(/\\/g, '/');
    case 'backward':
      return filePath.replace(/\//g, '\\');
    case 'auto':
    default:
      return filePath;
  }
}

/**
 * Pure helper for formatting multi-file clipboard output.
 */
export function formatPaths(paths: string[], format: MultiFileFormat): string {
  switch (format) {
    case 'comma':
      return paths.join(', ');
    case 'array':
      return JSON.stringify(paths, null, 2);
    case 'newline':
    default:
      return paths.join('\n');
  }
}

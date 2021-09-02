import path from 'path';

/**
 * Checks whether `child` is a subdirectory of `parent`.
 * Based on the excellent StackOverflow answer at {@link https://stackoverflow.com/a/45242825/13191165}
 */
export function isSubDirectory(parent: string, dir: string): boolean {
  const relativePath = path.relative(parent, dir);

  return !!relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)
}
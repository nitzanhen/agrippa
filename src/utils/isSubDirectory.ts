import path from 'path';

/**
 * Checks whether `child` is a subdirectory of `parent`.
 * A path is considered to be a subdirectory of itself.
 * Based on the excellent StackOverflow answer at {@link https://stackoverflow.com/a/45242825/13191165}
 */
export function isSubDirectory(parent: string, dir: string): boolean {
  if (parent === dir) {
    return true;
  }

  const relativePath = path.relative(parent, dir);

  return !!relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)
}
import { readFile } from 'fs/promises';
import { dirname } from 'path';
import findUp from 'find-up';

/**
 * Looks up the file tree for the nearest package.json, and makes sure it's the Agrippa
 * package.json, then returns the `package.json`'s dirname; this is used as the root directory of the project.
 */
async function findAgrippaRoot(): Promise<string> {
  const pkgPath = await findUp('package.json') ?? null;
  if (!pkgPath) {
    throw new Error('Agrippa was not found!');
  }

  const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
  if (pkg.name !== 'agrippa') {
    throw new Error('Nearest package.json is not for agrippa!');
  }

  return dirname(pkgPath);
}

let agrippaPath: string | undefined = undefined;

/**
 * Returns the Agrippa root path; this is the directory in which the project's `package.json` is located.
 */
export async function getAgrippaRoot() {
  if (!agrippaPath) {
    agrippaPath = await findAgrippaRoot();
  }
  return agrippaPath;
}
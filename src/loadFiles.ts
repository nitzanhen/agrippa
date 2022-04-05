import { readFile } from 'fs/promises';
import findUp from 'find-up';
import { pipe, filter, entries, map, tuple, toObject } from 'rhax';
import { parse as parseJson } from 'json5';

const defaultFileQueries = {
  packageJson: 'package.json',
  tsconfig: 'tsconfig.json',
  agrippaConfig: '.agripparc.json',
};

/**
 * Finds and loads files needed for Agrippa's process. 
 * 
 * By default, Agrippa searches for:
 * - "package.json" file (key `packageJson`) 
 * - "tsconfig.json" (key `tsconfig`)
 * - ".agripparc.json" (key `agrippaConfig`)
 * 
 * This can be customized using the `customFileQueries` parameter.
 * 
 * @param customFileQueries optional record of custom files to search for. 
 * Its keys should be identifiers for the custom file lookups, and values should be 
 * the file queries themselves (`string` | `string[]`, passed to `findUp`). 
 * To disable Agrippa looking up one of its default files, its key can be passed with `null` here (e.g. `{ tsconfig: null }` disables tsconfig lookup).
 * 
 * @returns The loaded files as a record whose keys are string identifiers of files, and values are the file's parsed contents (as JSON)'
 * paths and contents. 
 * If a file was searched for and not found, it *will* have an entry in the record, with the corresponding value being `null`.
 */
export async function loadFiles(customFileQueries: Record<string, string | string[]> = {}) {
  const fileQueries: Record<string, string | string[]> = filter.object(({ ...defaultFileQueries, ...customFileQueries }), f => !!f);

  const filePromises = pipe(fileQueries)
    (entries)
    (map(([name, query]) => findUp(query)
      .then(async path => path ? parseJson(await readFile(path, 'utf8')) : null)
      .then(f => tuple(name, f))
    ))
    .go();

  const files = toObject(
    await Promise.all(filePromises)
  );

  return files;
}
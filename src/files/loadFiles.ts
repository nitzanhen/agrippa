import { pipe, filter, entries, map, tuple, toObject } from 'rhax';
import { FileQuery, loadFileQuery } from './loadFile';

const defaultFileQueries: Record<string, FileQuery> = {
  packageJson: { search: 'package.json' },
  tsconfig: { search: 'tsconfig.json' },
};

/**
 * Finds and loads files needed for Agrippa's process. 
 * 
 * By default, Agrippa searches for:
 * - "package.json" file (key `packageJson`) 
 * - "tsconfig.json" (key `tsconfig`)
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
export async function loadFiles(customFileQueries: Record<string, string | FileQuery | null> = {}) {
  const fileQueries: Record<string, FileQuery> = pipe({ ...defaultFileQueries, ...customFileQueries })
    (entries)
    (filter(([, f]) => !!f))
    (map(([k, val]) => tuple(k, typeof val === 'string' ? { path: val } : val!)))
    (toObject)
    .go();

  const filePromises = pipe(fileQueries)
    (entries)
    (map(([name, query]) =>
      loadFileQuery(query).then(f => tuple(name, f))
    ))
    .go();

  const files = toObject(
    await Promise.all(filePromises)
  );

  return files;
}
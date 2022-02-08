import { readFile } from 'fs/promises';
import { basename, dirname, extname } from 'path';
import findUp from 'find-up';
import { parse as parseJson } from 'json5';
import { Agrippa } from '../utils';

async function loadFile(query: string | string[]): Promise<Agrippa.File | null> {
  const filePath = await findUp(query);

  if (!filePath) {
    return null;
  }

  const data = parseJson(
    await readFile(filePath, 'utf-8')
    /** @todo add catch(), logs */
  );

  const extension = extname(filePath);
  const name = basename(filePath, extension);
  const dir = dirname(filePath);

  return new Agrippa.File(dir, name, extension, data);
}

export const loadFiles = async <K extends keyof object>(fileQueries: Record<K, string | string[]>): Promise<Record<K, Agrippa.File | null>> => {

  // Expand to name-query pairs, map to lookup Promises, and wait
  const nameFilePairs = await Promise.all(
    (Object.entries(fileQueries) as [K, string | string[]][])
      .map(
        ([name, query]) => loadFile(query).then(result => [name, result] as [K, Agrippa.File | null])
      )
  );

  // Reduce back to record
  const files = nameFilePairs.reduce(
    (acc, [name, file]) => ({ ...acc, [name]: file }),
    {} as Record<K, Agrippa.File | null>
  );

  return files;
};
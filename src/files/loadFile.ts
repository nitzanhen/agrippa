import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, extname, join, resolve } from 'path';
import { cwd } from 'process';
import { pathToFileURL } from 'url';
import JSON5 from 'json5';
import findUp from 'find-up';
import ts from 'typescript';
import { pkgJsonPath } from '../utils/pkgJson';


const parseJson = JSON5.parse;

/**
 * Lists file types supported by loadFile, by their extension.
 */
export enum FileType {
  JSON = 'json',
  JS = 'js',
  MJS = 'mjs',
  TS = 'ts'
}

export namespace FileType {

  export const values: FileType[] = [FileType.JSON, FileType.JS, FileType.MJS, FileType.TS];

  export function fromString(str: string): FileType | null {
    return values.find(type => type === str) ?? null;
  }
}

export type FileQuery = { path: string } | { search: string | string[] };

/**
 * Loads a file located at the given path, assuming it is of the given type.
 * 
 * @param path the path to load the file from
 * @param type file type; if this is not specified, `loadFile` will try to guess 
 * the file's type based on its extension.
 */
export async function loadFile<T = any>(path: string, type?: (FileType | string)): Promise<T> {
  const extension = extname(path).slice(1);
  if (type && !FileType.fromString(type)) {
    throw new Error(`Unsupported file type: ${type}. loadFiles supports only the following file types: ${FileType.values.join(', ')}`);
  }


  const fileType = (type as FileType) ?? FileType.fromString(extension);


  if (!fileType) {
    throw new Error(`A type was not passed, and could not be determined from the file path (${path})`);
  }

  const resolvedPath = resolve(cwd(), path);

  switch (fileType) {
    case FileType.JSON: return parseJson(await readFile(resolvedPath, 'utf8'));
    case FileType.JS: return (await import(pathToFileURL(resolvedPath).toString())).default;
    case FileType.MJS: return (await import(pathToFileURL(resolvedPath).toString())).default;
    case FileType.TS: {
      const transpiledCode = ts.transpile(await readFile(resolvedPath, 'utf8'), {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ESNext
      });

      // Create temp dir, if it does not exists
      const agrippaRoot = dirname(pkgJsonPath);
      const tempDir = join(agrippaRoot, 'temp');
      await mkdir(tempDir, { recursive: true });

      // Write transpiled config to file and import it dynamically
      const transpiledPath = join(tempDir, './agrippa.config.mjs');
      await writeFile(transpiledPath, transpiledCode, 'utf8');
      return (await import(pathToFileURL(transpiledPath).toString())).default;
    }
  }
}

/**
 * Searches for a file by the given query; if found it is loaded (using `loadFile`), otherwise `null` is returned.
 * 
 * @param query the query to search by; this is forwarded to `findUp`.
 * @param type optional file type; see `loadFile()`.
 */
export async function loadFileQuery<T = any>(query: FileQuery, type?: (FileType | string)): Promise<[data: T | null, path: string | null]> {
  const path = 'path' in query ? query.path : (await findUp(query.search));
  if (!path) {
    return [null, null];
  }

  return [await loadFile(path, type), path];
}
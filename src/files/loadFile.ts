import { mkdir, readFile, unlink } from 'fs/promises';
import { dirname, extname, join, resolve } from 'path';
import JSON5 from 'json5';
import findUp from 'find-up';
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { pkgJsonPath } from '../utils/pkgJson';

const parseJson = JSON5.parse;

/**
 * Lists file types supported by loadFile, by their extension.
 */
export enum FileType {
  JSON = 'json',
  JS = 'js',
  MJS = 'mjs'
  //TS = 'ts'
}

export namespace FileType {

  export const values: FileType[] = [FileType.JSON, FileType.JS, FileType.MJS];

  export function fromString(str: string): FileType | null {
    return values.find(type => type === str) ?? null;
  }
}

export type FileQuery = { path: string } | { search: string };

// Compiles the file at the given path with rollup, then loads it as a commonjs module.
const compileWithRollup = async (path: string) => {
  // Create temp dir
  const agrippaRoot = dirname(pkgJsonPath);
  const tempDir = join(agrippaRoot, 'temp');
  await mkdir(tempDir, { recursive: true });

  const random = Math.floor(Math.random() * 1_000_000);
  const outPath = join(tempDir, `temp-${random}.js`);

  const bundle = await rollup({
    input: path,
    plugins: [
      nodeResolve(),
      commonjs()
    ],
    external: /node_modules/,
  });
  const result = await bundle.write({
    format: 'cjs',
    file: outPath,
    exports: 'default',
  });
  console.log(result);

  const data = require(outPath);
  await unlink(outPath);

  return data;
};


/**
 * Loads a file located at the given path, assuming it is of the given type.
 * 
 * @param path the path to load the file from
 * @param type file type; if this is not specified, `loadFile` will try to guess 
 * the file's type based on its extension.
 */
export async function loadFile<T = any>(path: string, basePath: string, type?: (FileType | string)): Promise<T> {
  const extension = extname(path).slice(1);
  if (type && !FileType.fromString(type)) {
    throw new Error(`Unsupported file type: ${type}. loadFiles supports only the following file types: ${FileType.values.join(', ')}`);
  }

  const fileType = (type as FileType) ?? FileType.fromString(extension);

  if (!fileType) {
    throw new Error(`A type was not passed, and could not be determined from the file path (${path})`);
  }

  const resolvedPath = resolve(basePath, path);
  console.log(basePath, path, resolvedPath);

  switch (fileType) {
    case FileType.JSON: return parseJson(await readFile(resolvedPath, 'utf8'));
    case FileType.JS:
    case FileType.MJS: {
      console.log(await compileWithRollup(resolvedPath));

      return await compileWithRollup(resolvedPath);
    }
  }
}

/**
 * Searches for a file by the given query; if found it is loaded (using `loadFile`), otherwise `null` is returned.
 * 
 * @param query the query to search by; this is forwarded to `findUp`.
 * @param type optional file type; see `loadFile()`.
 */
export async function loadFileQuery<T = any>(query: FileQuery, basePath: string, type?: (FileType | string)): Promise<[data: T | null, path: string | null]> {
  const path = 'path' in query ? query.path : (await findUp(query.search, { cwd: basePath }));
  if (!path) {
    return [null, null];
  }

  return [await loadFile(path, basePath, type), path];
}
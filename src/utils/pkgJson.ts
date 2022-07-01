import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import JSON5 from 'json5';
import findUp from 'find-up';

const parseJson = JSON5.parse;

const thisPath = typeof import.meta !== 'undefined'
  ? dirname(fileURLToPath(import.meta.url))
  : __dirname;

const pkgJsonPath = findUp.sync('package.json', { cwd: thisPath })!;

/**
 * This is *Agrippa's* package.json.
 */
export const pkgJson = parseJson(readFileSync(pkgJsonPath, 'utf-8'));
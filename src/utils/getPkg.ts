import fsp from 'fs/promises';
import findUp from 'find-up';
import { parse as parseJson } from 'json5';
import { logger } from '../logger';
import { format } from './strings';
import { panic } from './panic';

type PkgData = { pkgPath: string, pkg: any } | { pkgPath: null, pkg: null };

async function loadPkg(): Promise<PkgData> {
  logger.debug('Looking for .package.json...');

  const pkgPath = await findUp('package.json') ?? null;
  const pkg = pkgPath ? parseJson(
    (
      await fsp.readFile(pkgPath, 'utf-8').catch(e =>
        panic(
          'An unexpected error occured while parsing package.json.',
          'Please ensure that package.json is valid.',
          `Error:', ${format(e)}`
        ))
    ) as string
  ) : null;

  if (pkg) {
    logger.debug(
      'package.json found!',
      `path: ${format(pkgPath)}`,
      `content: ${format(pkg)}`
    );
  }
  else {
    logger.debug('No .package.json found.');
  }


  return { pkgPath, pkg };
}

let pkgData: PkgData | undefined = undefined;

export async function getPkg() {
  if (!pkgData) {
    pkgData = await loadPkg();
  }
  return pkgData;
}
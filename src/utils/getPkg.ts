import fsp from 'fs/promises';

import findUp from 'find-up'

import { logger } from '../logger';

type PkgData = { pkgPath: string, pkg: any } | { pkgPath: null, pkg: null };

async function loadPkg(): Promise<PkgData> {
  logger.debug('Looking for .package.json...')

  const pkgPath = await findUp('package.json') ?? null;
  const pkg = pkgPath ? JSON.parse(
    (
      await fsp.readFile(pkgPath, 'utf-8').catch(e => {
        logger.error(
          'An unexpected error occured while parsing package.json.\n'
          + 'Please ensure that package.json is valid, and has no trailing commas.\n'
          + 'Error:', e
        );
        process.exit(1)
      })
    ) as string
  ) : null

  if (pkg) {
    logger.debug('package.json found!')
    logger.debug(`path: ${pkgPath}`);
    logger.debug('content: ', pkg)
  }
  else {
    logger.debug('No .package.json found.')
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
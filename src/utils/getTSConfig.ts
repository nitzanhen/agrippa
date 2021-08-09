import { load } from 'tsconfig';

import { logger } from '../logger';

async function loadTSConfig() {
  const tsConfig = await load(process.cwd())
    .catch(e => {
      logger.error(
        'An unexpected error occured while parsing tsconfig.json.\n'
        + 'Please ensure that tsconfig.json is valid, and has no trailing commas.\n'
        + 'Error:', e
      );
      process.exit(1)
    });

  if (tsConfig.path) {
    logger.debug('tsconfig.json found!')
    logger.debug(`path: ${tsConfig.path}`);
    logger.debug('config:', tsConfig.config)

    return tsConfig.config;
  }
  else {
    logger.debug('No tsconfig.js found.')

    return null;
  }
}

let tsConfig: any = null;

export async function getTSConfig() {
  if (!tsConfig) {
    logger.debug('Looking for tsconfig.json...')
    tsConfig = await loadTSConfig();
  }

  return tsConfig;
}

import { load, LoadResult } from 'tsconfig';

import { logger } from '../logger';


async function loadTSConfig(): Promise<LoadResult> {
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
  }

  return tsConfig.config ?? null
}

let tsConfig: LoadResult | null = null;

export async function getTSConfig() {
  if (!tsConfig) {
    tsConfig = await loadTSConfig();
  }

  return tsConfig;
}

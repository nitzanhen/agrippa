import { load } from 'tsconfig';

import { logger } from '../logger';

type TSConfigData = { tsConfigPath: string, tsConfig: any } | { tsConfigPath: null, tsConfig: null };

async function loadTSConfig(): Promise<TSConfigData> {
  logger.debug('Looking for tsconfig.json...')

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
  else {
    logger.debug('No tsconfig.js found.')
  }

  return {
    tsConfigPath: tsConfig.path ?? null,
    tsConfig: tsConfig.config
  }
}

let tsConfigData: TSConfigData | undefined = undefined;


export async function getTSConfig() {
  if (!tsConfigData) {
    tsConfigData = await loadTSConfig();
  }

  return tsConfigData;
}

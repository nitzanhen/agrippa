import { load } from 'tsconfig';

import { logger } from '../logger';

import { panic } from './panic';

import { format } from './strings';

type TSConfigData = { tsConfigPath: string, tsConfig: any } | { tsConfigPath: null, tsConfig: null };

async function loadTSConfig(): Promise<TSConfigData> {
  logger.debug('Looking for tsconfig.json...')

  const tsConfig = await load(process.cwd())
    .catch(e =>
      panic(
        'An unexpected error occured while parsing tsconfig.json.',
        'Please ensure that tsconfig.json is valid, and has no trailing commas.',
        `Error: ${format(e)}`
      ));

  if (tsConfig.path) {
    logger.debug(
      'tsconfig.json found!',
      `path: ${format(tsConfig.path)}`,
      `config: ${format(tsConfig.config)}`
    )
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

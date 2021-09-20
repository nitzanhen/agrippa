import fsp from 'fs/promises';


import findUp from 'find-up';
import { parse as parseJson } from 'json5';

import { logger } from '../logger';

import { panic } from './panic';
import { format } from './strings';

type TSConfigData = { tsConfigPath: string, tsConfig: any } | { tsConfigPath: null, tsConfig: null };

async function loadTSConfig(): Promise<TSConfigData> {
  logger.debug('Looking for tsconfig.json...')

  const tsConfigPath = await findUp('./tsconfig.json') ?? null;

  const tsConfig = tsConfigPath ? parseJson(
    (
      await fsp.readFile(tsConfigPath, 'utf-8').catch(e =>
        panic(
          'An unexpected error occured while parsing tsconfig.json.',
          'Please ensure that tsconfig.json is valid.',
          `Error:', ${format(e)}`
        ))
    ) as string
  ) : null

  if (tsConfig) {
    logger.debug(
      'tsconfig.json found!',
      `path: ${format(tsConfigPath)}`,
      `config: ${format(tsConfig)}`
    )
  }
  else {
    logger.debug('No tsconfig.js found.')
  }

  return {
    tsConfigPath,
    tsConfig
  }
}

let tsConfigData: TSConfigData | undefined = undefined;


export async function getTSConfig() {
  if (!tsConfigData) {
    tsConfigData = await loadTSConfig();
  }

  return tsConfigData;
}

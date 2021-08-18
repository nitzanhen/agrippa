import fsp from 'fs/promises';

import findUp from 'find-up'

import { logger } from '../logger';
import { Config } from '../generate/Config';

import { format } from './strings';
import { panic } from './panic';

type RCData = { rcPath: string, rc: Partial<Config> } | { rcPath: null, rc: null };

async function loadRC(): Promise<RCData> {
  logger.debug('Looking for .agripparc.json...')

  const rcPath = await findUp('.agripparc.json') ?? null;
  const rc = rcPath ? JSON.parse(
    (
      await fsp.readFile(rcPath, 'utf-8').catch(e =>
        panic(
          'An unexpected error occured while parsing agripparc.json.',
          'Please ensure that agripparc.json is valid, and has no trailing commas.',
          `Error:', ${format(e)}`
        ))
    ) as string
  ) : null

  if (rc) {
    logger.debug(
      '.agripparc.json found!',
      `path: ${format(rcPath)}`,
      `config: ${format(rc)}`
    )
  }
  else {
    logger.debug('No .agripparc.json found.')
  }

  return { rcPath, rc };
}

let rcData: RCData | undefined = undefined;

export async function getRC() {
  if (!rcData) {
    rcData = await loadRC()
  }
  return rcData;
}


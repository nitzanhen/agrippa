import fsp from 'fs/promises';

import findUp from 'find-up'

import { logger } from '../logger';
import { Config } from '../Config';

async function loadRC() {
  logger.debug('Loading .agripparc.json...')

  const rcPath = await findUp('.agripparc.json');
  const rc = rcPath ? JSON.parse(
    (
      await fsp.readFile(rcPath, 'utf-8').catch(e => {
        logger.error(
          'An unexpected error occured while parsing agripparc.json.\n'
          + 'Please ensure that agripparc.json is valid, and has no trailing commas.\n'
          + 'Error:', e
        );
        process.exit(1)
      })
    ) as string
  ) : null

  if (rc) {
    logger.debug('.agripparc.json found!')
    logger.debug(`path: ${rcPath}`);
    logger.debug('config: ', rc)
  }

  return rc;
}

let rc: Partial<Config> | null = null;

export async function getRC() {
  if (!rc) {
    rc = await loadRC();
  }
  return rc;
}


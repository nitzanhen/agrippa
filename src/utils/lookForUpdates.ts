import axios from 'axios';
import { green } from 'chalk';
import { diff, gte, lte } from 'semver';

import { logger } from '../logger';

import { pkgJson } from './package';
import { panic } from './panic';

/**
 * Checks if a newer version of Agrippa exists.
 * Returns **a callback**, which can be executed to log an appropriate message to the console if necessary.
 * 
 * (The reason for this is that we want to call lookForUpdates() when agrippa launches, but defer the logging
 * to the end of the run.)
 */
export const lookForUpdates = async (): Promise<() => void> => {
  try {
    const res = await axios.get<{ version: string }>('https://registry.npmjs.org/agrippa/latest');
    const latestVersion = res.data.version;
    const currentVersion = pkgJson.version;

    return () => {
      if (gte(latestVersion, currentVersion)) {
        const df = diff(latestVersion, currentVersion);
        logger.info(`New ${df} version available: ${latestVersion}`); /** @todo logger.warn() */
      }
      else if (lte(latestVersion, currentVersion)) {
        logger.info(`Current version, ${green(currentVersion)}, is greater than the latest stable release, ${green(latestVersion)}`);
      }

      //nothing to do.
    };
  }
  catch (e) {
    panic(e);
  }
};
import axios from 'axios';
import { green } from 'chalk';

import { logger } from '../logger';

import { pkgJson } from './package';
import { panic } from './panic';
import { compareSemver } from './semver';

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
      const comp = compareSemver(currentVersion, latestVersion);

      if (comp === 1) {
        // currentVersion < latestVersion
        logger.info(`New version available: ${latestVersion}`); /** @todo logger.warn() */
      }
      else if (comp === -1) {
        logger.info(`Current version, ${green(currentVersion)}, is greater than the latest stable release, ${green(latestVersion)}`);
      }

      //nothing to do.
    };
  }
  catch (e) {
    panic(e);
  }
};
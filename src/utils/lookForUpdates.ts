import axios from 'axios';
import { italic, magenta, bold } from 'chalk';
import { diff, gt, lt } from 'semver';
import { Logger } from '../logger';
import { pkgJson } from './pkgJson';

/**
 * Checks if a newer version of Agrippa exists.
 * Returns **a callback**, which can be executed to log an appropriate message to the console if necessary.
 * 
 * (The reason for this is that we want to call lookForUpdates() when agrippa launches, but defer the logging
 * to the end of the run.)
 */
export const lookForUpdates = async (logger: Logger): Promise<() => void> => {
  logger.debug('lookForUpdates: pinging the npm registry');
  const sendTime = Date.now();
  const res = await axios.get<{ version: string }>('https://registry.npmjs.org/agrippa/latest');
  const endTime = Date.now();
  logger.debug(`lookForUpdates: request resolved with status ${res.status}, took ${endTime - sendTime}ms`);
  const latestVersion = res.data.version;
  const currentVersion = pkgJson.version;

  return () => {
    if (gt(latestVersion, currentVersion)) {
      const df = diff(latestVersion, currentVersion);
      logger.info(
        bold(`New ${df} version available: ${latestVersion}!`),
        bold(`please update now by typing ${magenta('npm i -g agrippa')} into the terminal`),
      );
    }
    else if (lt(latestVersion, currentVersion)) {
      logger.debug(`Current version, ${italic(currentVersion)}, is greater than the latest stable release, ${italic(latestVersion)}`);
    }

    //nothing to do.
  };
};
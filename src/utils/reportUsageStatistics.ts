import axios from 'axios';
import { pick } from 'rhax';
import { Config } from '../config';
import { Logger } from '../logger';
import { pkgJson } from './pkgJson';

export const reportUsageStatistics = async (config: Config, logger: Logger): Promise<void> => {
  const runData = {
    ...pick(config, 'environment', 'typescript', 'styling'),
    version: pkgJson.version
  };

  const timeStart = Date.now();

  try {
    logger.debug('reportUsageStatistics: sending report...');

    const reqPromise = axios.post(process.env.USAGE_ENDPOINT!, runData);

    if (!config.debug) {
      // If not in debug mode, don't even wait for the resuest to finish
      return;
    }

    await reqPromise;

    const timeEnd = Date.now();
    const time = timeEnd - timeStart;

    logger.debug(`reportUsageStatistics: received response in ${time}ms.`);
  }
  catch (e) {
    const timeEnd = Date.now();
    const time = timeEnd - timeStart;

    logger.debug(`reportUsageStatistics: request failed after ${time}ms. Error:`);
    logger.debug(e);
  }
};

reportUsageStatistics.silent = true;
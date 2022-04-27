import axios from 'axios';
import { pick } from 'rhax';
import { Config } from '../config';
import { Logger } from '../logger';
import { pkgJson } from './pkgJson';

export const reportUsageStatistics = async (config: Config, logger: Logger): Promise<void> => {
  const runData = {
    ...pick(config, 'environment', 'typescript', 'styling'),
    version: pkgJson.version,
    dev: process.env.IS_DEV
  };

  const sendTime = Date.now();

  try {
    logger.debug('reportUsageStatistics: sending report...');

    const reqPromise = axios.post(process.env.USAGE_ENDPOINT!, runData);

    if (!config.debug) {
      // If not in debug mode, don't even wait for the resuest to finish
      reqPromise.catch(() => null);
      return;
    }

    await reqPromise;

    const endTime = Date.now();

    logger.debug(`reportUsageStatistics: received response in ${endTime - sendTime}ms.`);
  }
  catch (e) {
    const endTime = Date.now();

    logger.debug(`reportUsageStatistics: request failed after ${endTime - sendTime}ms. Error:`);
    logger.debug(e);
  }
};

reportUsageStatistics.silent = true;
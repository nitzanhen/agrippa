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
    logger.debug('reportStatistics: sending report...');

    const reqPromise = axios.post(process.env.USAGE_ENDPOINT!, runData);

    if (!config.debug) {
      // If not in debug mode, don't even wait for the resuest to finish
      return;
    }

    const res = await reqPromise;

    const timeEnd = Date.now();
    const time = timeEnd - timeStart;

    logger.debug(`reportDiagnostics: received response in ${time}ms. Response:`);
    logger.debug(res);
  }
  catch (e) {
    const timeEnd = Date.now();
    const time = timeEnd - timeStart;

    logger.debug(`reportDiagnostics: request failed after ${time}ms. Error:`);
    logger.debug(e);
  }
};

reportUsageStatistics.silent = true;
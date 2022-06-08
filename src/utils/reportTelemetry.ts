import axios from 'axios';
import { pick } from 'rhax';
import { Options } from '../options';
import { Logger } from '../logger';
import { pkgJson } from './pkgJson';

const TELEMETRY_ENDPOINT = 'https://agrippa-report-worker.nitzanhen.workers.dev/';

export const reportTelemetry = async (options: Options, logger: Logger): Promise<void> => {
  const runData = {
    ...pick(options, 'environment', 'typescript', 'styling'),
    version: pkgJson.version,
    dev: options.debug
  };

  const sendTime = Date.now();

  try {
    logger.debug('reportUsageStatistics: sending report...');

    const reqPromise = axios.post(TELEMETRY_ENDPOINT, runData);

    if (!options.debug) {
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

reportTelemetry.silent = true;
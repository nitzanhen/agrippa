import axios from 'axios';
import { pick } from 'rhax';
import { Plugin } from './Plugin';

const TELEMETRY_ENDPOINT = 'https://agrippa-report-worker.nitzanhen.workers.dev/';

/**
 * A plugin that report telemery (completely anonymously!).
 */
export class TelemetryPlugin extends Plugin {
  async onPipelineEnd() {
    const { options, logger, version } = this.context;

    const runData = {
      ...pick(options, 'environment', 'typescript', 'styling'),
      version,
      /** @todo refactor to process.env.DEV variable */
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
  }
}
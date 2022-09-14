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
      ...pick(options, 'framework', 'typescript', 'styling'),
      version,
    };

    const sendTime = Date.now();

    try {
      logger.debug('TelemetryPlugin: sending report...');

      await axios.post(TELEMETRY_ENDPOINT, runData, {
        timeout: options.debug ? 0 : 5_000
      }).catch(e => {
        if(!options.debug && e.code === 'ECONNABORTED') {
          return;
        }
        throw e;
      });

      const endTime = Date.now();

      logger.debug(`TelemetryPlugin: received response in ${endTime - sendTime}ms.`);
    }
    catch (e) {
      const endTime = Date.now();

      logger.debug(`TelemetryPlugin: request failed after ${endTime - sendTime}ms. Error:`);
      logger.debug(e);
    }
  }
}
import axios from 'axios';
import semver from 'semver';
import { bold, italic } from '../logger';
import { Plugin } from './Plugin';

const { diff, gt, lt } = semver;

const AGRIPPA_NPM_ENDPOINT = 'https://registry.npmjs.org/agrippa/latest';

/**
 * A plugin that checks if a newer version of Agrippa exists.
 * Pings the npm registry and compares the latest version there to the version of this running instance.
 * 
 * This plugin runs assuming updates are meant to be looked for; if that's not desired (in pure mode or if
 * the user disables it) the plugin shouldn't be registered.
 */
export class UpdatesPlugin extends Plugin {
  private currentVersion: string | undefined = undefined;
  private requestPromise: Promise<string | undefined> | null = null;
  private failed = false;

  async pingRegistry() {
    const { logger } = this.context;

    logger.debug('UpdatesPlugin: pinging the npm registry');
    const sendTime = Date.now();

    try {
      const res = await axios.get<{ version: string }>(AGRIPPA_NPM_ENDPOINT, {
        timeout: 5_000
      });
      const endTime = Date.now();
      logger.debug(`UpdatesPlugin: request resolved with status ${res.status}, took ${endTime - sendTime}ms`);

      const latestVersion = res.data.version;

      return latestVersion;
    }
    catch (e) {
      logger.debug(`UpdatesPlugin - ${e.code === 'ECONNABORTED'
        ? 'pinging the NPM registry timed out.'
        : 'pinging the NPM registry failed.'
        }`
      );

      this.failed = true;
      logger.debug(e);
      return;
    }
  }

  onPipelineStart() {
    this.currentVersion = this.context.version;
    this.requestPromise = this.pingRegistry();
  }

  async onPipelineEnd() {
    const { logger } = this.context;

    const currentVersion = this.currentVersion!;
    const latestVersion = await this.requestPromise;

    if (this.failed) {
      return;
    }

    logger.debug(`Current version: ${italic(currentVersion)}, Latest version: ${italic(latestVersion)}`);
    if (!currentVersion || !latestVersion) {
      logger.warn('Error in UpdatesPlugin: currentVersion or latestVersion are not set.');
      return;
    }

    if (gt(latestVersion, currentVersion)) {
      const df = diff(latestVersion, currentVersion);
      logger.info(
        bold(`New ${df} version is available: ${latestVersion}!`),
        // bold(`please update now by typing ${styles.command('npm i -g agrippa')} into the terminal`),
      );
    }
    else if (lt(latestVersion, currentVersion)) {
      logger.debug('Current version is greater than the latest stable release');
    }

    //nothing to do.
  }
}
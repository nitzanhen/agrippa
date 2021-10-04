import yargs from 'yargs';

import { logger } from '../logger';
import { CommonConfig } from '../utils/types';

import { generateRC } from './generateRC';

export const initCommand: yargs.CommandModule<CommonConfig, CommonConfig> = {
  command: 'init',
  describe: 'Create a config file',
  handler: () => {
    logger.debug('Generating rc...');
    generateRC();
  }
};
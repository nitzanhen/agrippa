import { CommandModule } from 'yargs';
import { logger } from '../logger';
import { generateRC } from './generateRC';

export const initCommand: CommandModule = {
  command: 'init',
  describe: 'Create a config file',
  handler: () => {
    logger.debug('Generating rc...');
    generateRC();
  }
};
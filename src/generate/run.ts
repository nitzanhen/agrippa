import { Logger } from '../logger';
import { Config } from '../Config'

import { generateFiles } from './generateFiles';
import { generateReactCode } from './generateReactCode';

export async function run(config: Config, logger: Logger) {
  const componentCode = generateReactCode(config);
  try {
    await generateFiles(config, componentCode, logger);

    logger.debug('Success')
  }
  catch(e) {
    logger.error(e);
    process.exit(1);
  }
}
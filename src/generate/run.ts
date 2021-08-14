import { Logger } from '../logger';

import { Config } from './Config'
import { generateFiles } from './generateFiles';
import { generateReactCode } from './generateReactCode';
import { runPostCommand } from './runPostCommand';


export async function run(config: Config, logger: Logger) {
  const componentCode = generateReactCode(config);
  try {
    const generatedPaths = await generateFiles(config, componentCode, logger);

    logger.info('Generation successful.')
    logger.info('Generated files:')
    Object.values(generatedPaths).forEach(path => logger.info(path))

    const variablePaths = {
      '<componentPath>': generatedPaths.component,
      '<stylesPath>': generatedPaths.styles,
      '<dirPath>': generatedPaths.dir
    }
    await runPostCommand(variablePaths, config, logger);
  }
  catch (e) {
    logger.error(e);
    process.exit(1);
  }
}
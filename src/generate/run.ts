import { Logger } from '../logger';
import { panic } from '../utils/panic';

import { Config } from './Config';
import { generateFiles } from './generateFiles';
import { generateReactCode } from './generateReactCode';
import { runPostCommand } from './runPostCommand';


export async function run(config: Config, logger: Logger) {
  const componentCode = generateReactCode(config);
  try {
    const generatedPaths = await generateFiles(config, componentCode, logger);
    
    const uniquePaths = [...new Set(Object.values(generatedPaths))];
    logger.info(
      'Generation successful.',
      'Generated files:',
      ...uniquePaths
    );

    const variablePaths = {
      '<componentPath>': generatedPaths.component,
      '<stylesPath>': generatedPaths.styles,
      '<dirPath>': generatedPaths.dir,
      '<indexPath>': generatedPaths.index
    };
    await runPostCommand(variablePaths, config, logger);
  }
  catch (e) {
    panic(e);
  }
}
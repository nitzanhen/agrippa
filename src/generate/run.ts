import { kebabCase, pascalCase } from '../utils/strings';
import { Logger } from '../logger';
import { panic } from '../utils/panic';
import { Config } from './Config';
import { generateFiles } from './generateFiles';
import { runPostCommand } from './runPostCommand';


export async function run(config: Config, logger: Logger) {
  try {
    const generatedPaths = await generateFiles(config, logger);

    const postCommandVars = {
      '<componentPath>': generatedPaths.component,
      '<stylesPath>': generatedPaths.styles,
      '<dirPath>': generatedPaths.dir,
      '<indexPath>': generatedPaths.index,
      '<ComponentName>': pascalCase(config.name),
      '<component-name>': kebabCase(config.name)
    };
    await runPostCommand(postCommandVars, config, logger);

    logger.info(
      'Generation successful. Cheers!',
      ''
    );
  }
  catch (e) {
    panic(e);
  }
}
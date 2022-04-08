import { Config } from './Config';
import { Logger, styles } from './logger';
import { Context, Stage, summaryLine } from './stage';
import { indent } from './utils/strings';

export interface RunOptions {
  envFiles: Record<string, any>;
  config: Config;
  stages: Stage[]
}


/**
 * Main Agrippa process.
 * Generates directories, files and file contents based on the given params.
 */
export async function run(options: RunOptions) {
  const { config, stages } = options;

  let context: Context = {
    config,
    createdDirs: [],
    createdFiles: [],
  };

  const logger = new Logger(!config.pure ? process.stdout : undefined, process.stderr);
  logger.info(
    '',
    `Generating ${styles.componentName(config.name)}\n`,
    //`Environment: ${styles.tag(getEnvironmentTags(config))}`,
  );

  for (const stage of stages) {
    const stageLogger = new Logger();

    const result = await stage(context, stageLogger);
    const stageLogs = stageLogger.consume();
    logger.log(summaryLine(result));
    logger.log(indent(styles.comment(stageLogs), 2, ' ') + '\n');

    context = result.newContext ?? context;
  }

  return {
    logs: logger.consume()
  };
}
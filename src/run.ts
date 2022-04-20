import { createConfig, InputConfig } from './config';
import { loadFiles } from './loadFiles';
import { Logger, styles } from './logger';
import { Context, defaultStages, Stage, summaryLine } from './stage';
import { lookForUpdates } from './utils/lookForUpdates';
import { indent } from './utils/strings';

export interface RunOptions {
  envFiles?: Record<string, any>;
  stages?: Stage[]
}

/**
 * Main Agrippa process.
 * Generates directories, files and file contents based on the given params.
 */
export async function run(inputConfig: InputConfig, options: RunOptions = {}) {

  const updatePromise = lookForUpdates();

  const envFiles = options.envFiles ?? (await loadFiles());

  const config = createConfig(inputConfig, envFiles);

  const stages = options.stages ?? defaultStages(config);

  let context: Context = {
    config,
    createdDirs: [],
    createdFiles: [],
  };

  const logger = new Logger(config.debug);

  // Initialize logger
  if (!config.pure) {
    logger.on('log', ({ type, message }) => void (type === 'error' ? console.error : console.log)(message));
  }

  logger.info(
    '',
    `Generating ${styles.componentName(config.name)}\n`,
    //`Environment: ${styles.tag(getEnvironmentTags(config))}`,
  );

  for (const stage of stages) {
    const stageLogger = new Logger();

    const result = await stage(context, stageLogger);
    const stageLogs = stageLogger.consume();
    logger.info(summaryLine(result));
    logger.info(indent(styles.comment(stageLogs), 2, ' ') + '\n');

    context = result.newContext ?? context;
  }

  (await updatePromise)(logger);

  return {
    logs: logger.consume()
  };
}
import { createConfig, InputConfig } from './config';
import { loadFiles } from './loadFiles';
import { Logger, styles } from './logger';
import { Context, defaultStages, Stage, summaryLine } from './stage';
import { lookForUpdates } from './utils/lookForUpdates';
import { pkgJson } from './utils/pkgJson';
import { indent } from './utils/strings';

export interface RunOptions {
  envFiles?: Record<string, any>;
  stages?: Stage[]
  logger?: Logger
}

/**
 * Main Agrippa process.
 * Generates directories, files and file contents based on the given params.
 */
export async function run(inputConfig: InputConfig, options: RunOptions = {}) {

  // Initialize config, stages, context & logger

  const envFiles = options.envFiles ?? (await loadFiles());

  const config = createConfig(inputConfig, envFiles);

  const stages = options.stages ?? defaultStages(config);

  let context: Context = {
    config,
    createdDirs: [],
    createdFiles: [],
    variables: {
      'ComponentName': config.name,
      'component-name': config.kebabName
    }
  };

  const logger = options.logger ?? (
    config.pure
      ? new Logger(config.debug)
      : Logger.consoleLogger(config.debug)
  );

  const updatePromise = lookForUpdates(logger);

  logger.debug(
    `Logger initialized with params pure=${config.pure}, debug=${config.debug}`,
    'Core data:',
    'envFiles:', envFiles,
    'resolved config:', config,
    'stages:', stages
  );

  // Print header & some critical warnings, if any

  logger.info(
    '',
    `Agrippa v${pkgJson.version}`,
    '',
    `Generating ${styles.componentName(config.name)}\n`,
    //`Environment: ${styles.tag(getEnvironmentTags(config))}`,
  );

  if (!config.environment) {
    logger.warn(
      'No environment flag was received, and Agrippa was unable to detect the environment automatically.',
      'Please check your configuration.',
      ''
    );
  }

  logger.debug('Executing pipeline: running stages', '');

  for (const stage of stages) {
    const stageLogger = new Logger();

    const result = await stage(context, stageLogger);
    const stageLogs = stageLogger.consume();

    if (!stage.silent) {
      logger.info(summaryLine(result));
      logger.info(indent(styles.comment(stageLogs), 2, ' ') + '\n');
    }
    else {
      logger.debug(stageLogs);
    }


    context = result.newContext ?? context;
  }

  logger.debug('Pipeline execution complete.');

  // Print an "Update is Available" message, if there's a new version available.
  (await updatePromise)();

  return {
    logs: logger.consume()
  };
}
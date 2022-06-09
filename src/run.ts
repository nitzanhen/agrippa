import { Config, createOptions, InputOptions } from './options';
import { loadFiles } from './files/loadFiles';
import { Logger, styles } from './logger';
import { Context, defaultStages, Stage, summaryLine } from './stage';
import { getStackTags } from './utils/getStackTags';
import { lookForUpdates } from './utils/lookForUpdates';
import { pkgJson } from './utils/pkgJson';
import { reportTelemetry } from './utils/reportTelemetry';
import { indent } from './utils/strings';
import { loadFileQuery } from './files';

export interface RunOptions {
  /** *paths* to envFiles that Agrippa should fetch */
  envFiles?: Record<string, string>;
  stages?: ((defaultStages: Stage[]) => Stage[]);
  logger?: Logger
}

/**
 * Main Agrippa process.
 * Generates directories, files and file contents based on the given params.
 */
export async function run(inputOptions: InputOptions, runOptions: RunOptions = {}) {

  // Initialize options, stages, context & logger
  const pure = !!inputOptions.pure;
  const debug = !!inputOptions.debug;

  const logger = runOptions.logger ?? (
    pure
      ? new Logger(!!debug)
      : Logger.consoleLogger(!!debug)
  );
  logger.debug(`Logger initialized with params pure=${pure}, debug=${debug}`);


  logger.debug(runOptions.envFiles?.agrippaConfig ? 'Agrippa config passed through runOptions' : 'Searching for agrippa.config.mjs...');
  const config: Config | null = await loadFileQuery(
    runOptions.envFiles?.agrippaConfig
      ? { path: runOptions.envFiles?.agrippaConfig }
      : { search: 'agrippa.config.mjs' }
  );

  logger.debug('Resolved Agrippa config: ', config);

  const envFiles = {
    config,
    ...(!inputOptions.pure
      ? await loadFiles({
        ...(config?.files ?? {}),
        ...(runOptions.envFiles ?? {})
      })
      : {}),
  };

  logger.debug('Resolved envFiles: ', envFiles);

  const options = createOptions(inputOptions, envFiles);

  logger.debug('Resolved options: ', options);

  const defStages = defaultStages(options);
  const stages = runOptions.stages ? runOptions.stages(defStages) : defStages;

  logger.debug('Resolved stages: ', stages);

  let context: Context = {
    options,
    createdDirs: [],
    createdFiles: [],
    variables: {
      'ComponentName': options.name,
      'component-name': options.kebabName
    }
  };

  const updatePromise = options.lookForUpdates ? lookForUpdates(logger) : null;


  // Print header & some critical warnings, if any

  logger.info(
    '',
    `Agrippa v${pkgJson.version}`,
    '',
    `Generating ${styles.componentName(options.name)}\n`,
    `Stack: ${styles.tag(getStackTags(options).join(' '))}`,
    ''
  );

  if (!options.environment) {
    logger.warn(
      'No environment flag was received, and Agrippa was unable to detect the environment automatically. Please check your configuration.',
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

  if (options.reportTelemetry) {
    await reportTelemetry(options, logger);
  }
  else {
    logger.debug('`options.reportTelemetry` is `false`, not sending usage statistics');
  }

  if (options.lookForUpdates) {
    // Print an "Update is Available" message, if there's a new version available.
    (await updatePromise)?.();
  }
  else {
    logger.debug('`options.lookForUpdates` is `false`, not pinging the npm registry');
  }

  return {
    ...context,
    logs: logger.consume()
  };
}
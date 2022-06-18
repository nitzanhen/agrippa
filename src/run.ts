import { dirname } from 'path';
import { Config, createOptions, InputOptions } from './options';
import { loadFiles } from './files/loadFiles';
import { Logger, styles } from './logger';
import { Context } from './stage';
import { loadFileQuery } from './files';
import { assignDefaults } from './utils/object';
import { Plugin } from './plugin';
import { UpdatesPlugin } from './plugin/UpdatesPlugin';
import { TelemetryPlugin } from './plugin/TelemetryPlugin';

export interface RunOptions {
  /** *paths* to envFiles that Agrippa should fetch */
  envFiles?: Record<string, string>;
  plugins?: Plugin[];
  logger?: Logger;
}

/**
 * Main Agrippa process.
 * Generates directories, files and file contents based on the given params.
 */
export async function run(inputOptions: InputOptions, runOptions: RunOptions = {}) {

  // Initialize options, stages, context & logger
  const pure = !!inputOptions.pure;
  const debug = !!inputOptions.debug;

  const logger = runOptions.logger ?? Logger.create(pure, debug);
  logger.debug(
    runOptions.logger
      ? 'Using logger passed in runOptions'
      : `Logger initialized with params pure=${pure}, debug=${debug}`
  );


  logger.debug(runOptions.envFiles?.agrippaConfig ? 'Agrippa config passed through runOptions' : 'Searching for agrippa.config.mjs...');
  const [config, configPath] = await loadFileQuery<Config>(
    runOptions.envFiles?.agrippaConfig
      ? { path: runOptions.envFiles?.agrippaConfig }
      : { search: 'agrippa.config.mjs' }
  );

  logger.debug('Resolved Agrippa config: ', config);

  // Merge the given input with the resolved config options
  inputOptions = assignDefaults(config?.options ?? {}, inputOptions);

  const envFileQueries = Object.assign({}, config?.files, runOptions?.envFiles);
  const envFiles = Object.assign(
    { config },
    !pure && await loadFiles(envFileQueries, dirname(configPath ?? ''))
  );

  logger.debug('Resolved envFiles: ', envFiles);

  const options = createOptions(inputOptions, envFiles);

  logger.debug('Resolved options: ', options);

  const context = new Context({
    options,
    variables: {
      'ComponentName': options.name,
      'component-name': options.kebabName
    },
    logger
  });

  runOptions.plugins?.forEach(p => context.addPlugin(p));

  if (options.lookForUpdates) {
    context.addPlugin(new UpdatesPlugin());
  }
  else {
    logger.debug('`options.lookForUpdates` is `false`, not pinging the npm registry');
  }
  if (options.reportTelemetry) {
    context.addPlugin(new TelemetryPlugin());
  }
  else {
    logger.debug('`options.reportTelemetry` is `false`, not sending usage statistics');
  }


  // Print header

  logger.info(
    '',
    `Agrippa v${context.version}`,
    '',
    `Generating ${styles.componentName(options.name)}\n`,
    `Stack: ${context.stackTags.map(t => styles.tag(t)).join(', ')}`,
    ''
  );

  await context.execute();

  return {
    ...context,
    logs: logger.consume()
  };
}
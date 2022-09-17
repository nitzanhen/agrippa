import { dirname } from 'path';
import { Config, createOptions, InputOptions } from './options';
import { loadFiles } from './files/loadFiles';
import { Logger, styles } from './logger';
import { Context } from './context';
import { loadFileQuery } from './files';
import { assignDefaults } from './utils/object';
import { Plugin } from './plugin';
import { UpdatesPlugin } from './plugin/UpdatesPlugin';
import { TelemetryPlugin } from './plugin/TelemetryPlugin';
import { kebabCase } from './utils';

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
  
  const debug = !!inputOptions.debug;

  // Create Logger

  const logger = runOptions.logger ?? Logger.consoleLogger(debug);
  logger.debug(
    runOptions.logger
      ? 'Using logger passed in runOptions'
      : `Logger initialized with debug=${debug}`
  );

  // Read Agrippa config

  logger.debug(runOptions.envFiles?.agrippaConfig ? 'Agrippa config passed through runOptions' : 'Searching for agrippa config...');
  const [config, configPath] = await loadFileQuery<Config>(
    runOptions.envFiles?.agrippaConfig
      ? { path: runOptions.envFiles?.agrippaConfig }
      : { search: ['agrippa.config.mjs', 'agrippa.config.ts'] }
  );
  logger.debug('Resolved Agrippa config: ', config);

  // Read Env files

  const envFileQueries = Object.assign({}, config?.files, runOptions?.envFiles);
  const envFiles = Object.assign(
    { config },
    await loadFiles(envFileQueries, dirname(configPath ?? ''))
  );
  logger.debug('Resolved envFiles: ', envFiles);

  // Create Options

  // Merge the given input with the resolved config options
  inputOptions = assignDefaults(config?.options ?? {}, inputOptions);

  const options = createOptions(inputOptions, envFiles);
  logger.debug('Resolved options: ', options);


  // Initialize context & add plugins

  const context = new Context({
    options,
    variables: {
      'ComponentName': options.name,
      'component-name': kebabCase(options.name)
    },
    logger
  });

  runOptions.plugins?.forEach(p => context.addPlugin(p));
  config?.plugins?.forEach(p => context.addPlugin(p));

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

  const stackTags = await context.getStackTags();

  logger.info(
    '',
    `Agrippa v${context.version}`,
    '',
    `Generating ${styles.componentName(options.name)}\n`,
    `Stack: ${stackTags.map(t => styles.tag(t)).join(', ')}`,
    ''
  );

  // Execute & return output

  const output = await context.execute();

  logger.info('Generation successful. Cheers!');

  return output;
}
import yargs, { BuilderCallback, CommandModule } from 'yargs';
import { InputConfig } from '../../config';
import { Environment } from '../../config/Environment';
import { Styling } from '../../config/Styling';
import { italic, Logger } from '../../logger';
import { run } from '../../run';
import { runCommand } from '../../stage/runCommand';

const cliLogger = Logger.consoleLogger();

const builder = async (yargs: yargs.Argv) =>
  yargs.positional('name', {
    desc: 'The name of the component to be generated',
    type: 'string',
    demandOption: true
  })
    .options({
      environment: {
        type: 'string',
        alias: 'env',
        desc: 'Which environment to generate the components for'
      },
      styling: {
        type: 'string',
        desc: 'Which styling solution to use'
      },
      'styling-module': {
        alias: 'stylingModule',
        type: 'boolean',
        desc: 'Whether to generate a scoped `module` stylesheet. Relevant only for `css` or `scss` styling options.'
      },

      typescript: {
        type: 'boolean',
        alias: 'ts',
        desc: 'Whether to use Typescript'
      },
      'ts-props-declaration': {
        alias: 'tsPropsDeclaration',
        choices: ['interface', 'type'] as const,
        desc: 'For TS components, whether to declare props as an interface or a type',
      },


      'import-react': {
        alias: 'importReact',
        type: 'boolean',
        desc: 'Whether to import React. Relevant only for `react` or `react-native` environments.'
      },
      overwrite: {
        type: 'boolean'
      },
      'base-dir': {
        alias: 'baseDir',
        type: 'string',
        desc: 'Path to a base directory which components should be genenrated in or relative to.',
      },
      destination: {
        alias: 'dest',
        type: 'string',
        desc: 'The path in which the component folder/files should be generated, relative to baseDir.',
      },
      'allow-outside-base': {
        alias: 'allowOutsideBase',
        type: 'boolean',
        desc: 'If true, allows components to be generated outside the resolved baseDir.',
      },
      'export-type': {
        alias: 'exportType',
        choices: ['named', 'default'] as const,
        desc: 'Whether to use a named export or a default export for the component.',
      },
      'declaration': {
        choices: ['const', 'function'] as const,
        desc: 'Whether to declare the component as a const with an arrow function or a function declaration.',
      },
      'prop-types': {
        type: 'boolean',
        alias: 'propTypes',
        desc: 'Whether to include a propTypes declaration for the component (for React or React Native projects).'
      },
      'post-command': {
        alias: 'postCommand',
        type: 'string',
      },
      'debug': {
        type: 'boolean'
      },
      'look-for-updates': {
        type: 'boolean',
        alias: 'lookForUpdates',
        desc: 'Whether to look for updates when running Agrippa or not.'
      },
      'report-usage-statistics': {
        type: 'boolean',
        alias: 'reportUsageStatistics',
        desc: 'Whether to report (anonymous) usage statistics or not.'
      },
      '$schema': {
        type: 'string'
      }
    })
    .middleware(({ debug = false }) => {
      if (debug) {
        process.env.IS_DEBUG = JSON.stringify(true);
        cliLogger.isDebug = true;

        cliLogger.debug('', 'Agrippa CLI: Debug mode is ON');
      }
    }, true);

type GenerateCommand = (typeof builder) extends BuilderCallback<{}, infer R> ? CommandModule<{}, R> : never

export const generateCommand: GenerateCommand = {
  command: 'generate <name> [options]',
  aliases: ['gen'],
  describe: 'Generate a component',
  builder,
  handler: async argv => {
    const environment = Environment.fromString(argv.environment!) ?? argv.environment;
    const styling = Styling.fromString(argv.styling!) ?? argv.styling;

    cliLogger.debug(`Agrippa CLI: received a 'generate' command for component ${italic(argv.name)} in environment ${italic(environment)}`);
    cliLogger.debug('argv:', argv);

    const inputConfig: InputConfig = {
      name: argv.name,
      environment,

      typescript: argv.typescript,
      typescriptOptions: {
        propDeclaration: argv.tsPropsDeclaration
      },

      componentOptions: {
        exportType: argv.exportType,
        declaration: argv.declaration,
      },

      reactOptions: {
        importReact: argv.importReact,
        propTypes: argv.propTypes
      },

      styling,
      styleFileOptions: {
        module: argv.stylingModule
      },

      baseDir: argv.baseDir,
      destination: argv.destination,
      allowOutsideBase: argv.allowOutsideBase,

      debug: argv.debug,
      overwrite: argv.overwrite,
      reportUsageStatistics: argv.reportUsageStatistics,
      lookForUpdates: argv.lookForUpdates,
      pure: false,
    };

    const postCommandStage = (argv.postCommand && runCommand(argv.postCommand)) || undefined;

    await run(
      inputConfig,
      {
        logger: cliLogger,
        stages: postCommandStage && (defStages => [...defStages, postCommandStage])
      }
    );
  }
};
import yargs, { BuilderCallback, CommandModule } from 'yargs';
import { InputOptions } from '../../options';
import { Framework } from '../../options/Framework';
import { Styling } from '../../options/Styling';
import { italic, Logger } from '../../logger';
import { run } from '../../run';
import { PostCommandPlugin } from '../../plugin/PostCommandPlugin';

const cliLogger = Logger.consoleLogger();

const builder = async (yargs: yargs.Argv) =>
  yargs.positional('name', {
    desc: 'The name of the component to be generated',
    type: 'string',
    demandOption: true
  })
    .options({
      framework: {
        type: 'string',
        alias: 'fw',
        desc: 'Which framework to generate the components for'
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
        desc: 'Whether to import React. Relevant only for `react` or `react-native`.'
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
      'report-telemetry': {
        type: 'boolean',
        alias: 'reportTelemetry',
        desc: 'Whether to report (anonymous!) telemetry or not.'
      }
    })
    .middleware(({ debug = false }) => {
      if (debug) {
        process.env.IS_DEBUG = JSON.stringify(true);
        cliLogger.isDebug = true;

        cliLogger.debug('', 'Agrippa CLI: Debug mode is ON');
      }
    }, true);

type GenerateCommand = (typeof builder) extends BuilderCallback<{}, infer R> ? CommandModule<{}, R> : never;

export const generateCommand: GenerateCommand = {
  command: 'generate <name> [options]',
  aliases: ['gen'],
  describe: 'Generate a component',
  builder,
  handler: async argv => {
    const framework = Framework.fromString(argv.framework!) ?? argv.framework;
    const styling = Styling.fromString(argv.styling!) ?? argv.styling;

    cliLogger.debug(`Agrippa CLI: received a 'generate' command for component ${italic(argv.name)} with framework ${italic(framework)}`);
    cliLogger.debug('argv:', argv);

    const inputOptions: InputOptions = {
      name: argv.name,
      framework,

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
      reportTelemetry: argv.reportTelemetry,
      lookForUpdates: argv.lookForUpdates,
      pure: false,
    };

    await run(
      inputOptions,
      {
        logger: cliLogger,
        plugins: argv.postCommand ? [new PostCommandPlugin(argv.postCommand)] : undefined
      }
    );
  }
};
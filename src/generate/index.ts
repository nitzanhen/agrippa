import path from 'path';

import yargs, { BuilderCallback, CommandModule } from 'yargs';
import { pick } from 'rhax';

import { green } from 'chalk';

import { logger } from '../logger';
import { CommonConfig } from '../utils/types';
import { getTSConfig } from '../utils/getTSConfig';
import { getRC } from '../utils/getRC';
import { getPkg } from '../utils/getPkg';
import { format } from '../utils/strings';
import { panic } from '../utils/panic';

import { Config } from './Config';
import { run } from './run';

const builder = async (yargs: yargs.Argv<CommonConfig>) => {
  const [{ tsConfig }, { rc, rcPath }, { pkgPath, pkg }] = await Promise.all(
    [getTSConfig(), getRC(), getPkg()]
  );

  const isReactNative = (pkg?.dependencies) && 'react-native' in pkg.dependencies;

  return yargs.positional('name', {
    desc: 'The name of the component to be generated',
    type: 'string',
    demandOption: true
  })
    .config(rc ?? {})
    .options({
      props: {
        choices: ['ts', 'jsdoc', 'prop-types', 'none'],
        desc: 'Which prop declaration method to use'
      },
      children: {
        type: 'boolean',
        desc: 'Whether the component is meant to have children (FC) or not (VFC)',
        default: false
      },
      typescript: {
        type: 'boolean',
        alias: 'ts',
        desc: 'Whether to use Typescript',
        default: !!tsConfig
      },
      flat: {
        type: 'boolean',
        desc: 'Whether to apply in current dir (true) or create a new dir (false)',
        default: false
      },
      styling: {
        choices: ['none', 'css', 'scss', 'jss', 'mui', 'react-native'],
        desc: 'Which styling to generate',
        default: isReactNative ? 'react-native' : 'none'
      },
      'styling-module': {
        alias: 'stylingModule',
        type: 'boolean',
        default: true,
        desc: 'Relevant for `css` or `scss` styling. If true, generates a scoped `module` stylesheet'
      },
      'import-react': {
        alias: 'importReact',
        type: 'boolean',
        default: tsConfig?.compilerOptions?.jsx ? !/^react-jsx/.test(tsConfig.compilerOptions.jsx) : true,
        desc: 'Whether to import React.'
      },
      overwrite: {
        type: 'boolean',
        default: false
      },
      'post-command': {
        alias: 'postCommand',
        type: 'string',
        desc: 'A command to run after a component was successfully generated.'
      },
      'base-dir': {
        alias: 'baseDir',
        type: 'string',
        desc: 'Path to a base directory which components should be genenrated in or relative to.',
      },
      'destination': {
        alias: 'dest',
        type: 'string',
        desc: 'The path in which the component folder/files should be generated, relative to baseDir.',
        default: '.'
      },
      'allow-outside-base': {
        alias: 'allowOutsideBase',
        type: 'boolean',
        desc: 'If true, allows components to be generated outside the resolved baseDir.',
        default: false
      },
      'export-type': {
        alias: 'exportType',
        choices: ['named', 'default'], // If a valid use case arise, 'none' can be added as an option.
        desc: 'Whether to use a named export or a default export for the component.',
        default: 'named'
      },
      'declaration': {
        choices: ['const', 'function'],
        desc: 'Whether to declare the component as a const with an arrow function or a function declaration.',
        default: 'const'
      },
      'memo': {
        type: 'boolean',
        desc: 'If true, a memo() component will be generated. *Overrides --declaration*',
        default: false,
      },
      'separate-index': {
        alias: 'separateIndex',
        type: 'boolean',
        default: false
      },
      'react-native': {
        alias: 'reactNative',
        type: 'boolean',
        default: isReactNative
      },
      '$schema': {
        type: 'string'
      }
    } as const)
    .coerce('base-dir', (baseDir: string | undefined) => {
      logger.debug(`baseDir option, before resolving, is ${baseDir}`);

      if (!baseDir) {
        logger.debug('No baseDir specified, resolving relative to cwd');
        return undefined;
      }
      else if (rcPath) {
        const resolvedPath = path.resolve(path.dirname(rcPath), baseDir);
        logger.debug(`Path resolved relative to .agripparc.json: ${resolvedPath}`);
        return resolvedPath;
      }
      else if (pkgPath) {
        const resolvedPath = path.resolve(path.dirname(pkgPath), baseDir);
        logger.debug(`Path resolved relative to package.json: ${resolvedPath}`);
        return resolvedPath;
      }

      panic(
        'An error occured while resolving baseDir.',
      );
    })
    .check(argv => {
      const { props, typescript } = argv;
      if (props === 'ts' && !typescript) {
        throw new Error(`${green('props')} field was set to 'ts', but ${green('typescript')} is false.`);
      }

      return true;
    })
    .check(argv => {
      if (argv['separate-index'] && argv.flat) {
        logger.warn(`The ${green('separateIndex')} and ${green('flat')} flags were both set. Ignoring ${green('separateIndex')}...`);
      }

      return true;
    })
    .check(argv => {
      const { styling } = argv;

      if (argv['react-native'] && !['none', 'react-native'].includes(styling)) {
        throw new Error(`${green('react-native')} mode only supports 'none' or 'react-native' for styling; received ${styling} instead.`);
      }

      return true;
    });
};


type GenerateCommand = (typeof builder) extends BuilderCallback<CommonConfig, infer R> ? CommandModule<CommonConfig, R> : never

export const generateCommand: GenerateCommand = {
  command: 'generate <name> [options]',
  aliases: ['gen'],
  describe: 'Generate a component',
  builder,
  handler: async argv => {
    const config: Config = {
      name: argv.name as string,
      ...pick(['children', 'typescript', 'flat', 'styling', 'debug', 'overwrite', 'destination', 'declaration', 'memo'], argv),
      props: argv.props ?? (argv.typescript ? 'ts' : 'none'),
      stylingModule: argv['styling-module'],
      importReact: argv['import-react'],
      postCommand: argv['post-command'],
      baseDir: argv['base-dir'],
      allowOutsideBase: argv['allow-outside-base'],
      exportType: argv['export-type'],
      separateIndex: argv['separate-index'],
      reactNative: argv['react-native']
    };

    logger.debug(
      'Generating component...',
      `config: ${format(config)}`
    );

    await run(config, logger);
  }
};
import path from 'path';

import yargs, { BuilderCallback, CommandModule } from 'yargs';
import { pick } from 'rhax';

import { logger } from '../logger';
import { CommonConfig } from '../utils/types';
import { getTSConfig } from '../utils/getTSConfig';
import { getRC } from '../utils/getRC';
import { getPkg } from '../utils/getPkg';

import { Config } from './Config';
import { run } from './run';

const builder = async (yargs: yargs.Argv<CommonConfig>) => {
  const [{ tsConfig }, { rc, rcPath }, { pkgPath }] = await Promise.all(
    [getTSConfig(), getRC(), getPkg()]
  )

  return yargs.positional('name', {
    desc: 'The name of the component to be generated',
    type: 'string',
    demandOption: true
  })
    .config(rc ?? {})
    .options({
      props: {
        choices: ['ts', 'jsdoc', 'prop-types', 'none'],
        default: tsConfig ? 'ts' : 'none'
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
        choices: ['none', 'css', 'scss', 'jss', 'mui'],
        desc: 'Which styling to generate',
        default: 'none'
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
      }
    } as const)
    .coerce('base-dir', function (baseDir: string | undefined) {
      logger.debug(`baseDir option, before resolving, is ${baseDir}`)

      if (!baseDir) {
        logger.debug('No baseDir specified, resolving relative to cwd');
        return process.cwd()
      }
      else if (rcPath) {
        const resolvedPath = path.resolve(path.dirname(rcPath), baseDir)
        logger.debug(`Path resolved relative to .agripparc.json: ${resolvedPath}`);
        return resolvedPath;
      }
      else if (pkgPath) {
        const resolvedPath = path.resolve(path.dirname(pkgPath), baseDir)
        logger.debug(`Path resolved relative to package.json: ${resolvedPath}`)
        return resolvedPath;
      }

      logger.error('Error resolving baseDir.');
      process.exit(1);
    });
}


type GenerateCommand = (typeof builder) extends BuilderCallback<CommonConfig, infer R> ? CommandModule<CommonConfig, R> : never

export const generateCommand: GenerateCommand = {
  command: 'generate <name> [options]',
  aliases: ['gen'],
  describe: 'Generate a component',
  builder,
  handler: async (argv) => {

    const config: Config = {
      name: argv.name as string,
      ...pick(['props', 'children', 'typescript', 'flat', 'styling', 'debug', 'overwrite', 'destination'], argv),
      stylingModule: argv['styling-module'],
      importReact: argv['import-react'],
      postCommand: argv['post-command'],
      baseDir: argv['base-dir']!,
    }

    logger.debug('Generating component...')
    logger.debug('config:', config)
    run(config, logger);
  }
}
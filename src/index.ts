#!/usr/bin/env node

import fsp from 'fs/promises';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import findUp from 'find-up';
import { pick } from 'rhax';
import { load as loadTSConfig, LoadResult } from 'tsconfig';

import { Config } from './Config';
import { Logger } from './logger';
import { run } from './run';

const logger = new Logger(false);

async function main() {

  // Attempt to read an agrippa config file

  const rcPath = await findUp('.agripparc.json');
  const rc = rcPath ? JSON.parse(
    (
      await fsp.readFile(rcPath, 'utf-8').catch(e => {
        logger.error(
          'An unexpected error occured while parsing agripparc.json.\n'
          + 'Please ensure that agripparc.json is valid, and has no trailing commas.\n'
          + 'Error:', e
        );
        process.exit(1)
      })
    ) as string
  ) : {}


  // Attempt to read a tsconfig file

  const tsConfig = (await loadTSConfig(process.cwd())
    .catch(e => {
      logger.error(
        'An unexpected error occured while parsing tsconfig.json.\n'
        + 'Please ensure that tsconfig.json is valid, and has no trailing commas.\n'
        + 'Error:', e
      );
      process.exit(1)
    })) as LoadResult;

  // Parse args

  const argv = await yargs(hideBin(process.argv))
    .command('$0 <name> [options]', 'Generate a component', (yargs) => {
      yargs.positional('name', {
        desc: 'The name of the component to be generated',
        type: 'string',
        demandOption: true
      })
    })
    .config(rc)
    .options({
      props: {
        choices: ['ts', 'jsdoc', 'prop-types', 'none'],
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
      stylingModule: {
        type: 'boolean',
        default: true,
        desc: 'Relevant for `css` or `scss` styling. If true, generates a scoped `module` stylesheet'
      },
      importReact: {
        type: 'boolean',
        default: !/^react-jsx/.test(tsConfig.config?.compilerOptions?.jsx) ?? true,
        desc: 'Whether to import React.'
      },
      debug: {
        type: 'boolean',
        default: false,
      },
      overwrite: {
        type: 'boolean',
        default: false
      }
    } as const)
    .recommendCommands()
    .argv;

  const config: Config = {
    ...pick(['children', 'typescript', 'flat', 'styling', 'stylingModule', 'importReact', 'debug', 'overwrite'], argv),
    name: argv.name as string,
    props: (argv.props ?? 'ts') /** @todo */,
  }

  logger.isDebug = config.debug;

  logger.debug(rcPath, rc);
  logger.debug(tsConfig.path, tsConfig.config);
  logger.debug(config);

  run(config, logger);
}

main();


#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Config } from './Config';
import { run } from './run';

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .command('$0 <name> [options]', 'Generate a component', (yargs) => {
      yargs.positional('name', {
        desc: 'The name of the component to be generated',
        type: 'string',
        demandOption: true
      })
    })
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
        default: true
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
        default: true,
        desc: 'Whether to import React.'
      },
      debug: {
        type: 'boolean',
        default: true,

      }
    } as const)
    .recommendCommands()
    .argv;

  /** @todo refactor to Rhax code */
  const config: Config = {
    name: argv.name as string,
    props: (argv.props ?? 'ts') /** @todo */,
    children: argv.children,
    typescript: argv.typescript,
    flat: argv.flat,
    styling: argv.styling,
    stylingModule: argv.stylingModule,
    importReact: argv.importReact,
    debug: argv.debug
  }

  run(config);
}

main();


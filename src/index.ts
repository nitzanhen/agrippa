#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { generateCommand } from './generate';
import { initCommand } from './init';

// Init yargs
yargs(hideBin(process.argv))
  .option('debug', {
    type: 'boolean',
    default: false,
    global: true
  })
  .command(generateCommand)
  .command(initCommand)
  .wrap(yargs.terminalWidth())
  .recommendCommands()
  .strict()
  .demandCommand(1, 'Please specify a command')
  .parse()





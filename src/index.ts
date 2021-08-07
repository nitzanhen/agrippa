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
  })
  .command(generateCommand)
  .command(initCommand)
  .wrap(yargs.terminalWidth())
  .recommendCommands()
  .parse()





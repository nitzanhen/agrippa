#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { generateCommand } from './generate';
import { initCommand } from './init';
import { logger } from './logger';

// Init yargs
yargs(hideBin(process.argv))
  .option('debug', {
    type: 'boolean',
    default: false,
  })
  .middleware(args => {
    logger.isDebug = args.debug
  })
  .command(generateCommand)
  .command(initCommand)
  .wrap(yargs.terminalWidth())
  .recommendCommands()
  .parse()





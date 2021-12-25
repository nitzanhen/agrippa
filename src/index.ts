#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateCommand } from './generate';
import { initCommand } from './init';
import { logger } from './logger';
import { lookForUpdates } from './utils/lookForUpdates';
import { pkgJson } from './utils/package';
import { panic } from './utils/panic';

logger.info(`\nAgrippa v${pkgJson.version}`);

const updatePromise = lookForUpdates();

// Init yargs
yargs(hideBin(process.argv))
  .command(generateCommand)
  .command(initCommand)
  .wrap(yargs.terminalWidth())
  .recommendCommands()
  .strict()
  .demandCommand(1, 'Please specify a command')
  .parseAsync()
  .then(() => updatePromise)
  .then(updateCallback => updateCallback())
  .catch(panic);





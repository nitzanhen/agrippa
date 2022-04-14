import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { lookForUpdates } from '../utils/lookForUpdates';
import { generateCommand } from './generate';
// import { initCommand } from './init';

// logger.info(`\nAgrippa v${pkgJson.version}`);

const updatePromise = lookForUpdates();

// Init yargs
yargs(hideBin(process.argv))
  .command(generateCommand)
  //.command(initCommand)
  .wrap(yargs.terminalWidth())
  .recommendCommands()
  .strict()
  .demandCommand(1, 'Please specify a command')
  .parseAsync()
  .then(() => updatePromise)
  .then(updateCallback => updateCallback())
  .catch(console.error);



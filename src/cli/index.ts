import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateCommand } from './generate';
import { initCommand } from './init';

// Init yargs
yargs(hideBin(process.argv)).command(generateCommand)
  .command(initCommand)
  .recommendCommands()
  .strict()
  .demandCommand(1, 'Please specify a command')
  .parseAsync()
  .catch(console.error);



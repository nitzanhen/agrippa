import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateCommand } from './generate';
import { initCommand } from './init';

// logger.info(`\nAgrippa v${pkgJson.version}`);

const y = yargs();

// Init yargs
y
  .command(generateCommand)
  .command(initCommand)
  .recommendCommands()
  .strict()
  .demandCommand(1, 'Please specify a command')
  .parseAsync(hideBin(process.argv))
  .catch(console.error);



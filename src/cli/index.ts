import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateCommand } from './generate';
// import { initCommand } from './init';

// logger.info(`\nAgrippa v${pkgJson.version}`);


// Init yargs
yargs(hideBin(process.argv))
  .command(generateCommand)
  //.command(initCommand)
  .wrap(yargs.terminalWidth())
  .recommendCommands()
  .strict()
  .demandCommand(1, 'Please specify a command')
  .parseAsync()
  .catch(console.error);



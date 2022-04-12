import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateCommand } from './generate';
import { initCommand } from './init';
import { lookForUpdates } from '../utils/lookForUpdates';

// logger.info(`\nAgrippa v${pkgJson.version}`);

const updatePromise = lookForUpdates();

// Init yargs
yargs(hideBin(process.argv))
  // .command(generateCommand)
  // .command(initCommand)
  .wrap(yargs.terminalWidth())
  .recommendCommands()
  .strict()
  .demandCommand(1, 'Please specify a command')
  .parseAsync()
  .then(() => updatePromise)
  .then(updateCallback => updateCallback())
  .catch(console.error);

// import { loadFiles } from '../loadFiles';
// import { run } from '../run';


// async function main() {

//   const envFiles = await loadFiles();

//   await run({
//     name: 'NiceComponent',
//     environment: 'react-native',
//     styling: 'react-native',
//     overwrite: true
//   },
//     { envFiles }
//   );
// }

// main().catch(console.error);



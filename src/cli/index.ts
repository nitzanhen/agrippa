import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateCommand } from './generate';
import { initCommand } from './init';

const y = yargs(hideBin(process.argv));

y.scriptName('agrippa');

y.command(generateCommand);
y.command(initCommand);
y.command({
  command: ['$0'],
  handler: () => void y.showHelp()
});

y.recommendCommands()
  .showHelpOnFail(false)
  .strict();

y.parseAsync()
  .catch(console.error);



import { red, cyan, blue } from 'colors/safe'
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export class Logger {
  constructor(public isDebug: boolean) { }

  error(...errs: unknown[]) {
    console.error(`[${red('ERROR')}]:`, ...errs);
  }
  debug(...messages: unknown[]) {
    if (this.isDebug) {
      console.log(`[${cyan('DEBUG')}]:`, ...messages)
    }
  }
  info(...messages: unknown[]) {
    console.info(`[${blue('INFO')}]:`, ...messages)
  }
}

const DEBUG = yargs(hideBin(process.argv))
  .option('debug', {
    type: 'boolean',
    default: false
  }).parseSync().debug

export const logger = new Logger(DEBUG);
import { red, cyan, blue, yellow } from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { format } from './utils/strings';

export class Logger {
  constructor(public isDebug: boolean) { }

  error(...errs: unknown[]) {
    const prefixedErrs = errs.map(err => `[${red('ERROR')}]: ${format(err)}`).join('\n');
    console.error(prefixedErrs);
  }
  debug(...messages: unknown[]) {
    if (this.isDebug) {
      const prefixedMesssages = messages.map(msg => `[${cyan('DEBUG')}]: ${format(msg)}`).join('\n');
      console.log(prefixedMesssages);
    }
  }
  info(...messages: unknown[]) {
    const prefixedMesssages = messages.map(msg => `[${blue('INFO')}]: ${format(msg)}`).join('\n');
    console.info(prefixedMesssages);
  }

  warn(...warnings: unknown[]) {
    const prefixedErrs = warnings.map(warning => `[${yellow('WARN')}]: ${format(warning)}`).join('\n');
    console.log(prefixedErrs);
  }
}

const DEBUG = yargs(hideBin(process.argv))
  .option('debug', {
    type: 'boolean',
    default: false
  }).parseSync().debug;

export const logger = new Logger(DEBUG);
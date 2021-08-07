import { red, cyan } from 'colors/safe'

export class Logger {
  constructor(public isDebug: boolean) {}

  error(...errs: unknown[]) {
    console.error(`[${red('ERROR')}]:`, ...errs);
  } 
  debug(...messages: unknown[]) {
    if(this.isDebug) {
      console.log(`[${cyan('DEBUG')}]:`, ...messages)
    }
  }
}

export const logger = new Logger(false);
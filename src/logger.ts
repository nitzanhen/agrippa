import { red, cyan } from 'colors/safe'

import { Config } from './Config';

export class Logger {
  constructor(private config: Config) {}

  error(err: unknown) {
    console.error(`[${red('ERROR')}]:`, err);
  } 
  debug(message: unknown) {
    if(this.config.debug) {
      console.log(`[${cyan('DEBUG')}]:`, message)
    }
  }
}
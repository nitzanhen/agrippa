import EventEmitter from 'events';
import { formatWithOptions } from 'util';
import { styles } from './styles';

export namespace Logger {
  export type LogType = 'info' | 'debug' | 'warning' | 'error'

  export interface Log {
    type: LogType;
    message: string;
  }
}

export interface LoggerEvents extends Record<Logger.LogType, (message: string) => void> {
  'log': (log: Logger.Log) => void;
}

export interface Logger {
  on<E extends keyof LoggerEvents>(event: E, listener: LoggerEvents[E]): this;
  emit<E extends keyof LoggerEvents>(event: E, ...args: Parameters<LoggerEvents[E]>): boolean;
}

/** 
 * Logger class for Agrippa. This is a simple EventEmitter, with event for each of
 * the defined `Logger.LogType`s, as well as a generic `'log'` event.
 */
export class Logger extends EventEmitter {

  public isDebug;
  protected logs: Logger.Log[] = [];

  constructor(isDebug = false) {
    super();
    this.isDebug = isDebug;

    // To prevent Node.js crash on first error
    // this.on('error', () => {});
  }

  protected format(args: unknown[], style: (x: unknown) => unknown = x => x) {
    return formatWithOptions({ colors: true }, ...args.map(m => style(m)));
  }


  log(type: Logger.LogType, message: string): void {
    const logObject = { type, message };

    this.logs.push(logObject);
    this.emit('log', logObject);

    this.emit(type, message);
  }

  debug(...data: any[]): void {
    if (this.isDebug) {
      const message = this.format(data, styles.debug);
      this.log('debug', message);
    }
  }

  info(...data: any[]): void {
    const message = this.format(data);
    this.log('info', message);
  }

  warn(...data: any[]): void {
    const message = this.format(data, styles.warning);
    this.log('warning', message);
  }

  error(...data: any[]): void {
    const message = this.format(data, styles.error);
    this.log('error', message);

  }

  /**
   * Consumes this logger: aggregates all accumulated logs to one string, which is returned, 
   * and clears the inner logs. Typically, a logger is shouldn't used after being `consume`d, 
   * but currently it does not break the logger's functionality.
   */
  consume() {
    const logs = this.logs;
    this.logs = [];
    return logs.map(l => l.message).join('\n');
  }

}

export const globalLogger = new Logger();
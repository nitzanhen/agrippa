import { formatWithOptions } from 'util';
import { Chalk } from 'chalk';
import { indent } from '../utils';
import { StageStatus } from '../pipeline/Stage';
import { LogObserver } from './LogObserver';
import { styles } from './styles';

export class Logger {
  private _logs: string[];

  get logs() {
    return this._logs;
  }

  constructor(
    private observer: LogObserver | null = null,
    logs: string[] = []
  ) {
    this._logs = logs;
  }

  private format(...args: unknown[]) {
    return formatWithOptions({ colors: true }, ...args);
  }

  private log(messages: unknown[], channel: 'stdout' | 'stderr', style?: Chalk) {
    const msg = messages
      .map(m => this.format(m))
      .map(m => style ? style(m) : m)
      .join('\n');

    this._logs.push(msg);

    this.observer?.[channel](msg);
  }

  info(...messages: unknown[]) {
    this.log(messages, 'stdout');
  }

  error(...errs: unknown[]) {
    this.log(errs, 'stderr', styles.error);
  }

  debug(...messages: unknown[]) {
    if (process.env.DEBUG) {
      this.log(messages, 'stdout', styles.debug);
    }
  }

  warn(...warnings: unknown[]) {
    this.log(warnings, 'stdout', styles.warning);
  }

  /** Consumes the StageLog's logs. */
  consume(stageLogs: Logger, status: StageStatus, summary: string) {
    const summaryLine = styles[status].bold(`${StageStatus.bullets[status]} ${summary}`);

    this.log([
      summaryLine,
      ...stageLogs.logs.map(l => indent(l, 1, '  ')),
      ''
    ], 'stdout', styles.comment);
  }
}
import { Writable } from 'stream';
import { formatWithOptions } from 'util';

const emptyWritable = () => new Writable({ write() { } });

/** @todo reduce boilerplate in overrides, add description */
export class Logger extends console.Console {

  private logs: string[] = [];

  constructor(
    out: NodeJS.WritableStream = emptyWritable(),
    err?: NodeJS.WritableStream
  ) {
    super(out, err, false);
  }

  private format(...args: unknown[]) {
    return formatWithOptions({ colors: true }, ...args);
  }

  /** @override */
  log(...data: any[]): void {
    const s = this.format(...data);
    super.log(s);
    this.logs.push(s);
  }

  /** @override */
  info(...data: any[]): void {
    const s = this.format(...data);
    super.info(s);
    this.logs.push(s);
  }

  /** @override */
  warn(...data: any[]): void {
    const s = this.format(...data);
    super.warn(s);
    this.logs.push(s);
  }

  /** @override */
  error(...data: any[]): void {
    const s = this.format(...data);
    super.error(s);
    this.logs.push(s);
  }

  /**
   * @todo description.
   */
  consume() {
    return this.logs.join('\n');
  }


}
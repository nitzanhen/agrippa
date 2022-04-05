import { Writable } from 'stream';

export class Logger extends console.Console {

  private logChunks: Buffer[] = [];
  protected readonly out: NodeJS.WritableStream;
  protected readonly err?: NodeJS.WritableStream;

  constructor(
    out?: NodeJS.WritableStream,
    err?: NodeJS.WritableStream
  ) {
    out = new Writable({
      write: (chunk, ...args) => {
        out?.write(chunk, ...args);
        this.logChunks.push(chunk);
      }
    });

    super(out, err, false);
    this.out = out;
    this.err = err;
  }

  /**
   * @todo description.
   * Logger *shouldn't be used after it is consumed.*
   */
  consume() {
    this.out.end();
    this.err?.end();
    return Buffer.concat(this.logChunks).toString('utf8');
  }
}
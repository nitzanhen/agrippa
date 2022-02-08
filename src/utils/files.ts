import { join } from 'path';

export namespace Agrippa {
  export class File {
    constructor(
      public readonly dir: string,
      public readonly name: string,
      public readonly extension: string,
      public readonly data: string,
    ) { }

    get path(): string {
      return join(this.dir, `${this.name}.${this.extension}`);
    }
  }

  export interface Dir {
    path: string;
  }
}
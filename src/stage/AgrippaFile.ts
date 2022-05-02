import { basename, dirname, extname } from 'path';

export class AgrippaFile {
  constructor(
    public readonly path: string,
    public readonly data: string
  ) { }

  get directory() {
    return dirname(this.path);
  }

  get extension() {
    return extname(this.path);
  }

  get fileName() {
    return basename(this.path, this.extension);
  }
}

import { AgrippaFile, CreateFileOptions, CreateFileStage } from '../stage';
import { Plugin } from './Plugin';

export class CreateFilePlugin extends Plugin {
  key: string;
  file: AgrippaFile;
  varKey: string | undefined;

  constructor({
    key,
    file,
    varKey
  }: CreateFileOptions) {
    super();

    this.key = key;
    this.file = file;
    this.varKey = varKey;
  }

  onCreateStages() {
    this.context.addStage(
      new CreateFileStage({
        key: this.key,
        file: this.file,
        varKey: this.varKey
      })
    );
  }
}
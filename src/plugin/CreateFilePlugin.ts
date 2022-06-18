import { AgrippaFile, CreateFileOptions, CreateFileStage } from '../stage';
import { Plugin } from './Plugin';

export class FilePlugin extends Plugin {
  file: AgrippaFile;
  varKey: string | undefined;

  constructor({
    file,
    varKey
  }: CreateFileOptions) {
    super();

    this.file = file;
    this.varKey = varKey;
  }

  onCreateStages() {
    this.context.addStage(
      new CreateFileStage({
        file: this.file,
        varKey: this.varKey
      })
    );
  }
}
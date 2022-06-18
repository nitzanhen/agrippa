import { AgrippaDir, CreateDirOptions, CreateDirStage } from '../stage';
import { Plugin } from './Plugin';

export class CreateDirPlugin extends Plugin {
  dir: AgrippaDir;
  recursive: boolean | undefined;
  varKey: string | undefined;

  constructor({
    dir,
    recursive,
    varKey
  }: CreateDirOptions) {
    super();

    this.dir = dir;
    this.recursive = recursive;
    this.varKey = varKey;
  }

  onCreateStages() {
    this.context.addStage(
      new CreateDirStage({
        dir: this.dir,
        recursive: this.recursive,
        varKey: this.varKey
      })
    );
  }
}
import { AgrippaDir, CreateDirOptions, CreateDirStage } from '../stage';
import { Plugin } from './Plugin';

export class CreateDirPlugin extends Plugin {
  key: string;
  dir: AgrippaDir;
  recursive: boolean | undefined;
  varKey: string | undefined;

  constructor({
    key,
    dir,
    recursive,
    varKey
  }: CreateDirOptions) {
    super();

    this.key = key;
    this.dir = dir;
    this.recursive = recursive;
    this.varKey = varKey;
  }

  onCreateStages() {
    this.context.addStage(
      new CreateDirStage({
        key: this.key,
        dir: this.dir,
        recursive: this.recursive,
        varKey: this.varKey
      })
    );
  }
}
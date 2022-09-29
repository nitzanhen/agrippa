import { IndexAppendStage, IndexAppenStageOptions } from '../stage/IndexAppendStage';
import { MaybePromise } from '../utils';
import { Plugin } from './Plugin';

export class IndexAppendPlugin extends Plugin {
  public createIfMissing: boolean;
  public dirKey: string;
  public extension: string | undefined;

  constructor({ 
    createIfMissing = false, 
    dirKey = 'dir', 
    extension 
  }: Partial<IndexAppenStageOptions>) {
    super();

    this.createIfMissing = createIfMissing;
    this.dirKey = dirKey;
    this.extension = extension;
  }
  onCreateStages(): MaybePromise<void> {
    this.context.addStage(
      new IndexAppendStage({
        createIfMissing: this.createIfMissing,
        dirKey: this.dirKey, 
        extension: this.extension 
      })
    );
  }
}
import { Logger } from '../logger';
import { CreateFileStage, Stage } from '../stage';
import { Plugin } from './Plugin';

export interface ReplacePluginOptions extends Pick<ReplacePlugin, 'fileKey' | 'searchValue' | 'replaceValue'> {}

/**
 * Performs a "Find & Replace" operation on a created file, given by its `fileKey`.
 * Runs before the file is created (i.e. it's already generated with the replaced code).
 * 
 * `searchValue` and `replaceValue` are passed to `replaceAll`.
 */
export class ReplacePlugin extends Plugin {
  fileKey: string;
  searchValue: string | RegExp;
  replaceValue: string | ((substring: string, ...args: any[]) => string);

  constructor({
    fileKey,
    searchValue,
    replaceValue
  }: ReplacePluginOptions) {
    super();

    this.fileKey = fileKey;
    this.searchValue = searchValue;
    this.replaceValue = replaceValue;
  }

  onStageStart(stage: Stage, stageLogger: Logger) {
    if((stage instanceof CreateFileStage) && stage.key === this.fileKey) {
      stageLogger.info('ReplacePlugin: file matches passed key. Replacing...');
      // @ts-expect-error same issue as https://github.com/microsoft/TypeScript/issues/50488
      stage.file.data = stage.file.data.replaceAll(this.searchValue, this.replaceValue);
    }
  }
}
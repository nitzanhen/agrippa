import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { relative, resolve } from 'path';
import { Context } from '../context';
import { Logger } from '../logger';
import { Stage } from './Stage';
import { StageResult, StageStatus } from './StageResult';

export interface IndexAppenStageOptions extends Pick<IndexAppendStage, 'createIfMissing' | 'dirKey' | 'extension'> { }

export class IndexAppendStage extends Stage {
  public createIfMissing: boolean;
  public dirKey: string;
  public extension: string | undefined;

  constructor({
    createIfMissing,
    dirKey,
    extension
  }: IndexAppenStageOptions
  ) {
    super();

    this.createIfMissing = createIfMissing;
    this.dirKey = dirKey;
    this.extension = extension;
  }

  async execute(context: Context, logger: Logger): Promise<StageResult> {

    const dir = context.getDir(this.dirKey);

    if (!dir) {
      return new StageResult(
        StageStatus.WARNING,
        `No directory was found with the given key '${this.dirKey}'`
      );
    }

    try {
      const extension = this.extension ?? (context.options.typescript ? 'ts' : 'js');

      const indexPath = resolve(dir.path, '..', `index.${extension}`);
      logger.debug('IndexAppendStage: resolved indexPath is ', indexPath);
  
      const indexExists = existsSync(indexPath);
      if(!indexExists && !this.createIfMissing) {
        logger.info("To create a parent index file whenever it's missing, set the 'createIfMissing' option to `true`");

        return new StageResult(
          StageStatus.NA,
          'Parent index file does not exist'
        );
      }
      
      const data = indexExists ? await readFile(indexPath, 'utf8') : '';
  
      const exportStr = `export * from './${relative(indexPath, dir.path)}';\n`;
      
      const newData = data + (data.endsWith('\n') ? '' : '\n') + exportStr;
  
      logger.debug('IndexAppendStage: Writing new data to indexPath: ', newData);
      await writeFile(indexPath, newData, 'utf8');
  
      return new StageResult(
        StageStatus.SUCCESS,
        'Wrote component export in parent index file successfully.'
      );
    }
    catch(e) {
      logger.error(e);

      return new StageResult(
        StageStatus.ERROR,
        'Failed to append component export to parent index file.'
      );
    }

  }
}
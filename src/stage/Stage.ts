import { Logger } from '../logger';
import { Context } from '../Context';
import { StageResult } from './StageResult';

export abstract class Stage {
  /** If set, logs are not printed for this stage (only as debug output) */
  silent: boolean = false;

  abstract execute(context: Context, logger: Logger): Promise<StageResult>;
}
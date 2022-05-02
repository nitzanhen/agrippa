import { AgrippaFile } from './AgrippaFile';
import { Config } from '../config';
import { Logger, styles } from '../logger';
import { AgrippaDir } from './AgrippaDir';


export interface Context {
  config: Config;
  createdFiles: AgrippaFile[];
  createdDirs: AgrippaDir[];
  variables: Record<string, any>;
}

export interface Stage {
  /** If set, logs are not printed for this stage (only as debug output) */
  silent?: boolean;
  (context: Context, logger: Logger): Promise<StageResult>;
}

export interface StageResult {
  status: StageStatus,
  summary: string,
  newContext?: Context
}

export const stageStatusBullets: Record<StageStatus, string> = {
  success: '✓',
  warning: '✓',
  error: '✗',
  NA: '•',
};

export enum StageStatus {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  NA = 'NA'
}

export const stageResult = (status: StageStatus, summary: string, newContext?: Context): StageResult => ({ status, summary, newContext });

/** @todo find a better place for this? */
export const summaryLine = ({ status, summary }: StageResult) => styles[status].bold(`${stageStatusBullets[status]} ${summary}`);



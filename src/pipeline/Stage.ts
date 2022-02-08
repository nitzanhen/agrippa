import { Logger } from '../logger/Logger';
import { MaybePromise } from '../utils';
import { PipelineContext } from './PipelineContext';

export type Stage = (context: PipelineContext, logger: Logger) => MaybePromise<StageResponse>;

// eslint-disable-next-line import/export
export enum StageStatus {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  NA = 'NA'
}

// eslint-disable-next-line import/export
export namespace StageStatus {
  export const bullets: Record<StageStatus, string> = {
    success: '✓',
    warning: '✓',
    error: '✗',
    NA: '•',
  };
}


export interface StageResponse {
  status: StageStatus,
  summary: string,
  newContext?: PipelineContext
}


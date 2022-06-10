import { styles } from '../logger';
import { Context } from './Context';

export class StageResult {
  constructor(
    public readonly status: StageStatus, 
    public readonly summary: string, 
    public readonly newContext?: Context
  ) {}
}

const stageStatusBullets: Record<StageStatus, string> = {
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

export const summaryLine = ({ status, summary }: StageResult) => styles[status].bold(`${stageStatusBullets[status]} ${summary}`);





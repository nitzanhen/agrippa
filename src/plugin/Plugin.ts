import { Context } from '../context';
import { Logger } from '../logger';
import { Stage } from '../stage';
import { MaybePromise } from '../utils';

/**
 * @todo describe events
 */
export interface Plugin {
  context: Context;

  onContext?(): MaybePromise<void>;
  
  onCreateStages?(): MaybePromise<void>;
  onCreateStackTags?(): MaybePromise<void>;

  onStageStart?(stage: Stage, stageLogger: Logger): MaybePromise<void>;
  onStageEnd?(stage: Stage, stageLogger: Logger): MaybePromise<void>;

  onPipelineStart?(): MaybePromise<void>;
  onPipelineEnd?(): MaybePromise<void>;
}

export class Plugin {
  constructor() { }

  _initialize(context: Context) {
    this.context = context;

    this.onContext?.();

    this.onCreateStackTags && context.addListener('create-stack-tags', this.onCreateStackTags.bind(this));
    this.onCreateStages && context.addListener('create-stages', this.onCreateStages.bind(this));

    this.onStageStart && context.addListener('stage-start', this.onStageStart.bind(this));
    this.onStageEnd && context.addListener('stage-end', this.onStageEnd.bind(this));

    this.onPipelineStart && context.addListener('pipeline-start', this.onPipelineStart.bind(this));
    this.onPipelineEnd && context.addListener('pipeline-end', this.onPipelineEnd.bind(this));
  }
}
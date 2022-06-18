import { Context } from '../stage';
import { MaybePromise } from '../utils';

/**
 * @todo describe events
 */
export interface Plugin {
  context: Context;

  onContext?(): MaybePromise<void>;
  onLoad?(): MaybePromise<void>;
  /** @todo should this be inside onLoad? */ 
  onCreateStages?(): MaybePromise<void>;

  onStageStart?(): MaybePromise<void>;
  onStageEnd?(): MaybePromise<void>;

  onPipelineStart?(): MaybePromise<void>;
  onPipelineEnd?(): MaybePromise<void>;
}

export class Plugin {
  constructor() {}

  _initialize(context: Context) {
    this.context = context;

    this.onContext?.();

    this.onStageStart && context.addListener('stage-start', this.onStageStart.bind(this));
    this.onStageEnd && context.addListener('stage-end', this.onStageEnd.bind(this));

    this.onPipelineStart && context.addListener('pipeline-start', this.onPipelineStart.bind(this));
    this.onPipelineEnd && context.addListener('pipeline-end', this.onPipelineEnd.bind(this));
  }
}
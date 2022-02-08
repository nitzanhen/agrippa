import { Logger } from '../logger';
import { Falsey } from '../utils';
import type { PipelineContext } from './PipelineContext';
import { Stage } from './Stage';

export type Pipeline = (Stage | Falsey)[];

export const execute = async (
  pipeline: Pipeline,
  initialContext: PipelineContext,
  logger: Logger
) => {
  let context = initialContext;

  for (const stage of pipeline) {
    if (typeof stage !== 'function') {
      continue;
    }

    const stageLogger = new Logger();

    const { status, summary, newContext } = await stage(context, stageLogger);

    if (newContext) {
      context = { ...context, ...newContext };
    }
    logger.consume(stageLogger, status, summary);
  }
};

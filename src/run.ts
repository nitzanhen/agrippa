import { Config } from './Config';
import { LogObserver, Logger } from './logger';
import { execute, loadFiles, Pipeline, PipelineContext } from './pipeline';

export interface RunOptions {
  pipeline: Pipeline,
  config?: Partial<Config>,
  logObserver?: LogObserver | null
}

/**
 * Agrippa's main entrypoint.
 * Expects to receive a (partial) config, and executes the pipeline. 
 */
export const run = async ({
  pipeline,
  config = {},
  logObserver = null
}: RunOptions) => {
  const loadedFiles = await loadFiles({
    '.agripparc.json': '.agripparc.json',
    'tsconfig.json': 'tsconfig.json',
    'package.json': 'package.json'
  });

  const initialContext: PipelineContext = {
    config: config as Config,
    createdDirs: [],
    createdFiles: [],
    loadedFiles
  };

  const logger = new Logger(logObserver);

  return execute(pipeline, initialContext, logger);
};
import { Logger, styles } from '../logger';
import { Options } from '../options/Options';
import { Plugin } from '../plugin';
import { indent } from '../utils';
import { AsyncEventEmitter } from '../utils/AsyncEventEmitter';
import { AgrippaDir } from './AgrippaDir';
import { AgrippaFile } from './AgrippaFile';
import { defaultStages } from './defaultStages';
import { Stage } from './Stage';
import { summaryLine } from './StageResult';

export interface ContextOptions {
  options: Options;
  plugins?: Plugin[];
  stages?: Stage[];

  createdFiles?: AgrippaFile[];
  createdDirs?: AgrippaDir[];
  variables?: Record<string, any>;
  logger?: Logger;
}

export type ContextEventMap = {
  'load': () => void;
  'create-stages': () => void;
  'stage-start': (stage: Stage) => void;
  'stage-end': (stage: Stage) => void;
  'pipeline-start': () => void;
  'pipeline-end': () => void;
}

export class Context extends AsyncEventEmitter<ContextEventMap> {
  options: Options;
  plugins: Plugin[];

  createdFiles: AgrippaFile[];
  createdDirs: AgrippaDir[];
  variables: Record<string, any>;
  stages: Stage[];

  logger: Logger;

  constructor({
    options,
    plugins = [],
    stages,

    createdFiles = [],
    createdDirs = [],
    variables = {},
    logger
  }: ContextOptions) {
    super();

    this.options = options;
    this.plugins = plugins;

    this.createdFiles = createdFiles;
    this.createdDirs = createdDirs;
    this.variables = variables;

    this.logger = logger ?? Logger.create(options.pure, options.debug);
    this.stages = stages ?? defaultStages(options, this.logger);

    for (const plugin of plugins) {
      plugin._initialize(this);
    }
  }

  get pure() {
    return this.options.pure;
  }
  get debug() {
    return this.options.debug;
  }


  addStage(stage: Stage): void {
    /** @todo add error/warning if stage is added too late */
    /** @todo priority list */
    this.stages.push(stage);
  }

  addPlugin(plugin: Plugin): void {
    /** @todo add error/warning if plugin is added too late */
    this.plugins.push(plugin);
    plugin._initialize(this);
  }

  addFile(file: AgrippaFile): void {
    this.createdFiles.push(file);
  }

  addDir(dir: AgrippaDir): void {
    this.createdDirs.push(dir);
  }

  addVariable(key: string, value: any): void {
    /** @todo add error/warning if variable is added too late */
    this.variables[key] = value;
  }

  async execute() {
    this.emit('create-stages');

    const logger = this.logger;

    logger.debug('Executing pipeline: running stages', '');

    await this.emit('pipeline-start');

    for (const stage of this.stages) {
      await this.emit('stage-start', stage);

      const stageLogger = new Logger();

      const result = await stage.execute(this, stageLogger);
      const stageLogs = stageLogger.consume();

      if (!stage.silent) {
        logger.info(summaryLine(result));
        logger.info(indent(styles.comment(stageLogs), 2, ' ') + '\n');
      }
      else {
        logger.debug(stageLogs);
      }

      await this.emit('stage-end', stage);
    }

    await this.emit('pipeline-end');

    logger.debug('Pipeline execution complete.');
  }
}
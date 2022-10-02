import { Logger, styles } from '../logger';
import { Options } from '../options/Options';
import { Plugin, defaultPlugins } from '../plugin';
import { indent } from '../utils';
import { AsyncEventEmitter } from '../utils/AsyncEventEmitter';
import { pkgJson } from '../utils/pkgJson';
import { AgrippaDir } from '../stage/AgrippaDir';
import { AgrippaFile } from '../stage/AgrippaFile';
import { Stage } from '../stage/Stage';
import { StageResult, StageStatus, summaryLine } from '../stage/StageResult';
import { RunOutput } from './RunOutput';

export interface ContextOptions {
  options: Options;
  plugins?: Plugin[];
  stages?: Stage[];

  createdFiles?: Record<string, AgrippaFile>;
  createdDirs?: Record<string, AgrippaDir>;
  variables?: Record<string, any>;
  logger?: Logger;

  stackTags?: string[];
}

export type ContextEventMap = {
  'load': () => void;
  'create-stack-tags': () => void;
  'create-stages': () => void;
  'stage-start': (stage: Stage, stageLogger: Logger) => void;
  'stage-end': (stage: Stage, stageLogger: Logger) => void;
  'pipeline-start': () => void;
  'pipeline-end': () => void;
}

export class Context extends AsyncEventEmitter<ContextEventMap> {
  public readonly version = pkgJson.version;

  options: Options;
  public readonly plugins: Plugin[];

  createdFiles: Record<string, AgrippaFile>;
  createdDirs: Record<string, AgrippaDir>;
  variables: Record<string, any>;

  stages: Stage[];
  stagesInitialized: boolean;

  stageResults: StageResult[];

  stackTags: string[];
  stackTagsInitialized: boolean;;

  public readonly logger: Logger;

  constructor({
    options,
    plugins,

    stages = [],
    createdFiles = Object.create(null),
    createdDirs = Object.create(null),
    variables = Object.create(null),
    logger,

    stackTags = []
  }: ContextOptions) {
    super();

    this.logger = logger ?? Logger.consoleLogger(options.debug);

    this.stages = stages;
    this.stagesInitialized = false;
    this.stageResults = [];

    this.options = options;
    this.plugins = plugins ?? defaultPlugins(options, this.logger);

    this.createdFiles = createdFiles;
    this.createdDirs = createdDirs;
    this.variables = variables;

    this.stackTags = stackTags;
    this.stackTagsInitialized = false;

    for (const plugin of this.plugins) {
      plugin._initialize(this);
    }
  }

  get dryRun() {
    return this.options.dryRun;
  }
  get debug() {
    return this.options.debug;
  }


  addStage(stage: Stage): void {
    /** @todo add error/warning if stage is added too late */
    /** @todo priority list */
    this.stages.push(stage);
  }

  async getStages(): Promise<Stage[]> {
    if(!this.stagesInitialized) {
      this.logger.debug('Initializing stages...');
      await this.emit('create-stages');
      this.stagesInitialized = true;
      this.logger.debug('Initialized stages:', this.stages);
    }

    return this.stages;
  }

  addStackTag(tag: string): void {
    this.stackTags.push(tag);
  }

  async getStackTags(): Promise<string[]> {
    if(!this.stackTagsInitialized) {
      this.logger.debug('Initializing stack tags...');
      await this.emit('create-stack-tags');
      this.stackTagsInitialized = true;
      this.logger.debug('Initialized stack tags: ', this.stackTags);
    }

    return this.stackTags;
  }

  addPlugin(plugin: Plugin): void {
    /** @todo add error/warning if plugin is added too late */
    this.plugins.push(plugin);
    plugin._initialize(this);
  }

  getFile(key: string): AgrippaFile | undefined {
    return this.createdFiles[key];
  }

  addFile(key: string, file: AgrippaFile): void {
    this.createdFiles[key] = file;
  }

  getDir(key: string): AgrippaDir | undefined {
    return this.createdDirs[key];
  }

  addDir(key: string, dir: AgrippaDir): void {
    this.createdDirs[key] = dir;
  }

  addVariable(key: string, value: any): void {
    /** @todo add error/warning if variable is added too late */
    this.variables[key] = value;
  }

  async execute(): Promise<RunOutput> {
    await this.getStages();
    await this.getStackTags();

    const logger = this.logger;

    logger.debug('Executing pipeline: running stages', '');

    await this.emit('pipeline-start');

    for (const stage of this.stages) {
      const stageLogger = new Logger();

      await this.emit('stage-start', stage, stageLogger);

      const result = await stage.execute(this, stageLogger);
      this.stageResults.push(result);

      await this.emit('stage-end', stage, stageLogger);

      const stageLogs = stageLogger.consume();

      if (!stage.silent) {
        logger.info(summaryLine(result));
        logger.info(indent(styles.comment(stageLogs), 2, ' ') + '\n');
      }
      else {
        logger.debug(stageLogs);
      }
    }

    await this.emit('pipeline-end');

    logger.debug('Pipeline execution complete.');

    const output: RunOutput = {
      options: this.options,
      plugins: this.plugins,
      stages: this.stages,
      createdFiles: this.createdFiles,
      createdDirs: this.createdDirs,
      variables: this.variables,
      stackTags: this.stackTags,

      logs: this.logger.consume()
    };

    return output;
  }

  get hasFailedStages() {
    return this.stageResults.some(res => res.status === StageStatus.ERROR);
  }
}
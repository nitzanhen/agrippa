import { Logger, styles } from '../logger';
import { Options } from '../options/Options';
import { Plugin , defaultPlugins } from '../plugin';
import { indent } from '../utils';
import { AsyncEventEmitter } from '../utils/AsyncEventEmitter';
import { pkgJson } from '../utils/pkgJson';
import { AgrippaDir } from '../stage/AgrippaDir';
import { AgrippaFile } from '../stage/AgrippaFile';
import { Stage } from '../stage/Stage';
import { summaryLine } from '../stage/StageResult';

export interface ContextOptions {
  options: Options;
  plugins?: Plugin[];
  stages?: Stage[];

  createdFiles?: AgrippaFile[];
  createdDirs?: AgrippaDir[];
  variables?: Record<string, any>;
  logger?: Logger;

  stackTags?: string[];
}

export type ContextEventMap = {
  'load': () => void;
  'create-stack-tags': () => void;
  'create-stages': () => void;
  'stage-start': (stage: Stage) => void;
  'stage-end': (stage: Stage) => void;
  'pipeline-start': () => void;
  'pipeline-end': () => void;
}

export class Context extends AsyncEventEmitter<ContextEventMap> {
  public readonly version = pkgJson.version;

  options: Options;
  public readonly plugins: Plugin[];

  createdFiles: AgrippaFile[];
  createdDirs: AgrippaDir[];
  variables: Record<string, any>;
  stages: Stage[];

  stackTags: string[];

  public readonly logger: Logger;

  constructor({
    options,
    plugins,

    stages = [],
    createdFiles = [],
    createdDirs = [],
    variables = {},
    logger,

    stackTags = []
  }: ContextOptions) {
    super();

    this.logger = logger ?? Logger.create(options.pure, options.debug);
    this.stages = stages;

    this.options = options;
    this.plugins = plugins ?? defaultPlugins(options, this.logger);

    this.createdFiles = createdFiles;
    this.createdDirs = createdDirs;
    this.variables = variables;


    this.stackTags = stackTags;

    for (const plugin of this.plugins) {
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

  addStackTag(tag: string): void {
    this.stackTags.push(tag);
  }

  async execute() {
    await this.emit('create-stack-tags');
    await this.emit('create-stages');

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
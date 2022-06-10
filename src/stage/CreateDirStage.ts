import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import { basename } from 'path';
import { bold, italic, Logger, styles } from '../logger';
import { isSubDirectory } from '../utils/isSubDirectory';
import { joinLines } from '../utils';
import { Stage } from './Stage';
import { AgrippaDir } from './AgrippaDir';
import { Context } from './Context';
import { StageResult, StageStatus } from './StageResult';

export interface CreateDirOptions {
  dir: AgrippaDir;
  recursive?: boolean;
  varKey?: string;
}

export class CreateDirStage extends Stage {
  protected dir: AgrippaDir;
  /** Whether to recursively create this dir's parent directories, if necessary. Passed to `mkdir` */
  protected recursive: boolean;
  /** 
   * If passed, stores the new directory's path under the context's `variables` 
   * record with the passed value as key. Only stores the value if the stage succeeds.
   */
  protected varKey?: string;

  constructor({
    dir,
    recursive = true,
    varKey,
  }: CreateDirOptions) {
    super();

    this.dir = dir;
    this.recursive = recursive;
    this.varKey = varKey;
  }

  async execute(context: Context, logger: Logger): Promise<StageResult> {
    const { options } = context;
    const { pure, baseDir, allowOutsideBase, overwrite } = options;
    const { path } = this.dir;

    const dirName = basename(path);

    const successContext = {
      ...context,
      createdDirs: [...context.createdDirs, new AgrippaDir(path)],
      variables: this.varKey ? { ...context.variables, [this.varKey]: path } : context.variables
    };

    if (pure) {
      return new StageResult(
        StageStatus.NA,
        'No directory created (pure mode)',
        successContext
      );
    }

    if (baseDir && !isSubDirectory(baseDir, path) && !allowOutsideBase) {
      logger.error(joinLines(
        `The resolved path for the directory ${italic(dirName)} falls outside the base directory.`,
        `Base directory: ${italic(baseDir)}`,
        `Resolved directory: ${italic(path)}`,
        "To allow this behaviour, pass the '--allow-outside-base' flag or set 'allowOutsideBase: true' in .agripparc.json"
      ));

      return new StageResult(StageStatus.ERROR, 'Directory path outside baseDir');
    }

    logger.info(`path: ${styles.path(path)}`);


    if (existsSync(path) && !overwrite) {
      logger.info(`To allow overwriting, pass ${bold('--overwrite')} to the command.`);
      return new StageResult(StageStatus.ERROR, `Directory ${italic(dirName)} already exists.`);
    }

    try {
      await mkdir(path, { recursive: this.recursive });

      return new StageResult(
        StageStatus.SUCCESS,
        `Directory ${italic(dirName)} created successfully.`,
        successContext
      );
    }
    catch (e) {
      logger.error(e);

      return new StageResult(
        StageStatus.ERROR,
        `Creation of directory ${dirName} failed.`
      );
    }
  }
};
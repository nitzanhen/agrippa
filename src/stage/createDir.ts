import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import { basename } from 'path';
import { bold, italic, styles } from '../logger';
import { isSubDirectory } from '../utils/isSubDirectory';
import { joinLines } from '../utils';
import { Stage, stageResult, StageStatus } from './Stage';
import { AgrippaDir } from './AgrippaDir';

export interface CreateDirOptions extends AgrippaDir {
  /** Whether to recursively create this dir's parent directories, if necessary. Passed to `mkdir` */
  recursive?: boolean;
  /** 
   * If passed, stores the new directory's path under the context's `variables` 
   * record with the passed value as key. Only stores the value if the stage succeeds.
   */
  varKey?: string;
}

export const createDir = ({ path, recursive = true, varKey }: CreateDirOptions): Stage => {
  return async function dirStage(context, logger) {
    const { options } = context;
    const { pure, baseDir, allowOutsideBase, overwrite } = options;

    const dirName = basename(path);

    const successContext = {
      ...context,
      createdDirs: [...context.createdDirs, new AgrippaDir(path)],
      variables: varKey ? { ...context.variables, [varKey]: path } : context.variables
    };

    if (pure) {
      return stageResult(
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

      return stageResult(StageStatus.ERROR, 'Directory path outside baseDir');
    }

    logger.info(`path: ${styles.path(path)}`);


    if (existsSync(path) && !overwrite) {
      logger.info(`To allow overwriting, pass ${bold('--overwrite')} to the command.`);
      return stageResult(StageStatus.ERROR, `Directory ${italic(dirName)} already exists.`);
    }

    try {
      await mkdir(path, { recursive });

      return stageResult(
        StageStatus.SUCCESS,
        `Directory ${italic(dirName)} created successfully.`,
        successContext
      );
    }
    catch (e) {
      logger.error(e);

      return stageResult(
        StageStatus.ERROR,
        `Creation of directory ${dirName} failed.`
      );
    }
  };
};
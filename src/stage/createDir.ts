import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import { basename, resolve } from 'path';
import { bold, italic } from 'chalk';
import { AgrippaDir, AgrippaFile } from '../AgrippaFile';
import { styles } from '../logger';
import { createFile } from './createFile';
import { Stage, stageResult, StageStatus } from './Stage';

export interface CreateDirOptions extends AgrippaDir {
  /** Whether to recursively create this dir's parent directories, if necessary. Passed to `mkdir` */
  recursive?: boolean;
  /** Files to generate under this directory. File paths should be relative to this directory, e.g. `./index.ts` */
  files?: AgrippaFile[]
}

export const createDir = ({ path, recursive = true, files = [] }: CreateDirOptions): Stage[] => {
  const dirStage: Stage = async (context, logger) => {
    const { config } = context;

    const dirName = basename(path);
    logger.info(`path: ${styles.path(path)}`);

    if (config.pure) {
      return stageResult(StageStatus.NA, 'No file created (pure mode)');
    }

    if (existsSync(path) && !config.overwrite) {
      logger.info(`To allow overwriting, pass ${bold('--overwrite')} to the command.`);
      return stageResult(StageStatus.ERROR, `Directory ${italic(dirName)} already exists.`);
    }

    try {
      await mkdir(path, { recursive });

      return stageResult(
        StageStatus.SUCCESS,
        `Directory ${styles.italic(dirName)} created successfully.`,
        //{ ...context, createdDirs: [...context.createdDirs, { path }] }
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

  const fileStages = files
    .map(({ path: filePath, data }) => new AgrippaFile(resolve(path, filePath), data))
    .map(createFile);

  return [dirStage, ...fileStages];
};
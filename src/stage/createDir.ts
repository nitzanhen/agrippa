import { mkdir } from 'fs/promises';
import { basename, resolve } from 'path';
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

    if (config.pure) {
      return stageResult(StageStatus.NA, 'No file created (pure mode)');
    }

    await mkdir(path, { recursive });

    logger.info(`path: ${styles.path(path)}`);

    const dirName = basename(path);

    return stageResult(
      StageStatus.SUCCESS,
      `Directory ${styles.italic(dirName)} created successfully.`,
      //{ ...context, createdDirs: [...context.createdDirs, { path }] }
    );
  };

  const fileStages = files
    .map(({ path: filePath, data }) => new AgrippaFile(resolve(path, filePath), data))
    .map(createFile);

  return [dirStage, ...fileStages];
};
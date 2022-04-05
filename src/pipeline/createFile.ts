import { writeFile } from 'fs/promises';
import { basename } from 'path';
import { AgrippaFile } from '../AgrippaFile';
import { styles } from '../logger';
import { Stage, stageResult, StageStatus } from './Stage';

export const createFile = (file: AgrippaFile): Stage => {
  return async (context, logger) => {
    const { config } = context;

    if (!config.pure) {
      const { data, path } = file;

      await writeFile(path, data);

      logger.info(`path: ${styles.path(path)}`);

      const filename = basename(path);

      return stageResult(
        StageStatus.SUCCESS,
        `File ${styles.italic(filename)} created successfully.`,
        //{ ...context, createdFiles: [...context.createdFiles, file] }
      );
    }

    return {
      status: StageStatus.NA,
      summary: 'No file created (pure mode)'
    };
  };
};
import { writeFile } from 'fs/promises';
import { basename } from 'path';
import { styles } from '../logger';
import { Agrippa } from '../utils';
import { Stage, StageStatus } from './Stage';

export const createFile = (file: Agrippa.File): Stage => {
  return async (context, logger) => {
    const { config } = context;

    if (!config.pure) {
      const { data, path } = file;

      await writeFile(path, data);

      logger.info(`path: ${styles.path(path)}`);

      const filename = basename(path);

      return {
        status: StageStatus.SUCCESS,
        summary: `File ${styles.italic(filename)} created successfully.`,
        newContext: {
          ...context,
          createdFiles: [...context.createdFiles, file]
        }
      };
    }

    return {
      status: StageStatus.NA,
      summary: 'No file created (pure mode)'
    };
  };
};
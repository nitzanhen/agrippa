import { mkdir } from 'fs/promises';
import { basename } from 'path';
import { styles } from '../logger';
import { Agrippa } from '../utils';
import { Stage, StageStatus } from './Stage';

export interface CreateDirOptions extends Agrippa.Dir {
  recursive?: boolean
}

export const createDir = ({ path, recursive = true }: CreateDirOptions): Stage => {
  return async (context, logger) => {
    const { config } = context;

    if (!config.pure) {
      await mkdir(path, { recursive });

      logger.info(`path: ${styles.path(path)}`);

      const dirName = basename(path);

      return {
        status: StageStatus.SUCCESS,
        summary: `Directory ${styles.italic(dirName)} created successfully.`,
        newContext: {
          ...context,
          createdDirs: [
            ...context.createdDirs,
            { path }
          ]
        }
      };
    }

    return {
      status: StageStatus.NA,
      summary: 'No file created (pure mode)'
    };
  };
};
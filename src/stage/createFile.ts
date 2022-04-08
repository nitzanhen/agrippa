import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { basename } from 'path';
import { bold, italic } from 'chalk';
import { AgrippaFile } from '../AgrippaFile';
import { styles } from '../logger';
import { isSubDirectory } from '../utils/isSubDirectory';
import { Stage, stageResult, StageStatus } from './Stage';

export const createFile = (file: AgrippaFile): Stage => {
  return async (context, logger) => {
    const { config } = context;
    const { pure, baseDir, allowOutsideBase, overwrite } = config;
    const { data, path } = file;

    if (pure) {
      return stageResult(StageStatus.NA, 'No file created (pure mode)');
    }

    const filename = basename(path);

    if (baseDir && !isSubDirectory(baseDir, path) && !allowOutsideBase) {
      logger.error(`The resolved path for the directory ${italic(filename)} falls outside the base directory.`);
      logger.error(`Base directory: ${italic(baseDir)}`);
      logger.error(`Resolved directory: ${italic(path)}`);
      logger.error("To allow this behaviour, pass the '--allow-outside-base' flag or set 'allowOutsideBase: true' in .agripparc.json");

      return stageResult(StageStatus.ERROR, 'Directory path outside baseDir');
    }

    logger.info(`path: ${styles.path(path)}`);

    if (existsSync(path)) {
      if (!overwrite) {
        logger.info(`To allow overwriting, pass ${bold('--overwrite')} to the command.`);
        return stageResult(StageStatus.ERROR, `File ${italic(filename)} already exists.`);
      }

      // File exists, but --overwrite was passed; log for info and continure.
      logger.info('File exists, and was overwritten.');
    }

    try {
      await writeFile(path, data);

      return stageResult(
        StageStatus.SUCCESS,
        `File ${styles.italic(filename)} created successfully.`,
        { ...context, createdFiles: [...context.createdFiles, file] }
      );
    }
    catch (e) {
      logger.error(e);

      return stageResult(
        StageStatus.ERROR,
        `Creation of file ${filename} failed.`
      );
    }
  };
};
import { constants } from 'fs';
import fsp from 'fs/promises';
import path from 'path';

import { green } from 'chalk';

import { logger } from '../logger';
import { format } from '../utils/strings';
import { panic } from '../utils/panic';

export async function generateRC() {
  const templatePath = path.join(__dirname, 'rc-template.json');
  const destinationPath = path.join(process.cwd(), '.agripparc.json');

  try {
    await fsp.copyFile(templatePath, destinationPath, constants.COPYFILE_EXCL);
    logger.info(
      '',
      `Creation successful. Path: ${green(destinationPath)}`,
      ''
    );
  }
  catch (e) {
    if (e.code === 'EEXIST') {
      panic('An .agripparc.json config file already exists in the current working directory.');
    }
    else {
      panic(
        'An unexpected error occured while creating agripparc.json',
        `Error: ${format(e)}`
      );
    }
  }
}
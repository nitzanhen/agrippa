import { constants } from 'fs';
import fsp from 'fs/promises';
import path from 'path';

import { logger } from '../logger';


export async function generateRC() {
  const templatePath = path.join(__dirname, 'rc-template.json');
  const destinationPath = path.join(process.cwd(), '.agripparc.json');

  try {
    await fsp.copyFile(templatePath, destinationPath, constants.COPYFILE_EXCL)
  }
  catch(e) {
    if(e.code === 'EEXIST') {
      logger.error('An .agripparc.json config file already exists in the current working directory.')
    }
    else {
      logger.error(
        'An unexpected error occured while creating agripparc.json\n',
        + 'Error:', e
      )
    }
    process.exit(1);
  }
}
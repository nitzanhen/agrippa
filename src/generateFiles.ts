import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';

import { Config } from './Config';
import { kebabCase, pascalCase } from './utils';

/**
 * Generates the files required by the CLI - in a folder or flat.
 */
export async function generateFiles(config: Config, componentCode: string) {
  const { name, flat, typescript, styling, stylingModule, overwrite } = config;
  const cwd = process.cwd();

  const folder = flat ? cwd : path.join(cwd, name);

  if (!flat) {
    try {
      //Create the needed folder
      await fsp.mkdir(folder)
    }
    catch (e) {
      if (e.code === 'EEXISTS') {
        console.log(`Directory ${folder} already exists. Writing into it...`)
      }
      else {
        throw e;
      }
    }
  }

  const componentFileExtension = typescript ? 'tsx' : 'jsx'
  const componentFileName = `${flat ? pascalCase(name) : 'index'}.${componentFileExtension}`;
  const componentFilePath = path.join(folder, componentFileName);

  const stylesFileName = `${kebabCase(name)}${stylingModule ? '.module' : ''}.${styling}`;
  const stylesFilePath = path.join(folder, stylesFileName)

  const createStylesFile = styling === 'css' || styling === 'scss';

  if (!overwrite && (fs.existsSync(componentFilePath) || (createStylesFile && fs.existsSync(stylesFilePath)))) {
    console.log('Running this command would overwrite existing files. To allow this, pass --overwrite to the command.')
    process.exit(1);
  }

  await fsp.writeFile(componentFilePath, componentCode);

  if (createStylesFile) {
    await fsp.open(stylesFilePath, 'w')
  }

}
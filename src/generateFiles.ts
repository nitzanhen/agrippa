import { Config } from './Config';
import path from 'path';
import fs from 'fs/promises';
import { cstr } from './utils';

/**
 * Generates the files required by the CLI - in a folder or flat.
 */
export async function generateFiles(config: Config, componentCode: string) {
  const { name, flat, typescript, styling, stylingModule } = config;
  const cwd = process.cwd();

  const folder = flat ? cwd : path.join(cwd, name);

  if (!flat) {
    try {
      //Create the needed folder
      await fs.mkdir(folder)
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
  const componentFileName = `${flat ? name : 'index'}.${componentFileExtension}`;
  await fs.writeFile(path.join(folder, componentFileName), componentCode);

  if (styling === 'css' || styling === 'scss') {
    const stylesFileName = `${name}${cstr(stylingModule,'.module')}.${styling}`
    await fs.open(path.join(folder, stylesFileName), 'w')
  }
}
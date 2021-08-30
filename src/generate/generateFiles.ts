import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';

import { gray, green } from 'chalk';

import { cstr, kebabCase, pascalCase } from '../utils/strings';
import { Logger } from '../logger';
import { isSubDirectory } from '../utils/isSubDirectory';

import { panic } from '../utils/panic';

import { Config } from './Config';

// Mapping of created file paths by file type
interface GeneratedPaths {
  component: string;
  styles?: string;
  dir: string
}

/**
 * Generates the files required by the CLI - in a folder or flat.
 */
export async function generateFiles(config: Config, componentCode: string, logger: Logger): Promise<GeneratedPaths> {
  const { name, flat, typescript, styling, stylingModule, overwrite, baseDir, destination } = config;

  const pcName = pascalCase(name);
  const kcName = kebabCase(name);

  const dirPath = path.resolve(baseDir, destination, flat ? '.' : pcName);
  if (!isSubDirectory(baseDir, dirPath)) {
    panic(
      `The resolved directory for the component "${pcName}" falls outside the base directory:`,
      `Base directory: ${gray(baseDir)}`,
      `Resolved directory: ${gray(dirPath)}`,
      `If this is the desired behaviour, pass the ${green('--allow-outside-base')} flag or set ${green('allowOutsideBase: true')} in .agripparc.json`
    );
  }

  if (!flat) {
    try {
      //Create the needed folder
      await fsp.mkdir(dirPath, { recursive: true })
    }
    catch (e) {
      if (e.code === 'EEXIST') {
        logger.debug(`Directory ${gray(dirPath)} already exists. Writing into it...`)
      }
      else {
        throw e;
      }
    }
  }

  const componentFileExtension = typescript ? 'tsx' : 'jsx'
  const componentFileName = `${flat ? pcName : 'index'}.${componentFileExtension}`;
  const componentFilePath = path.join(dirPath, componentFileName);

  const stylesFileName = `${kcName}${cstr(stylingModule, '.module')}.${styling}`;
  const stylesFilePath = path.join(dirPath, stylesFileName)

  const createStylesFile = styling === 'css' || styling === 'scss';

  if (!overwrite && ((fs.existsSync(componentFilePath) || (createStylesFile && fs.existsSync(stylesFilePath))))) {
    panic(
      'Existing files would be overwritten by this command, leading to data loss.',
      `To allow overwriting, pass ${green('--overwrite')} to the command.`
    )
  }


  await fsp.writeFile(componentFilePath, componentCode);

  const generatedPaths: GeneratedPaths = {
    component: componentFilePath,
    dir: dirPath
  };

  if (createStylesFile) {
    await fsp.open(stylesFilePath, 'w')
    generatedPaths.styles = stylesFilePath;
  }

  return generatedPaths;
}
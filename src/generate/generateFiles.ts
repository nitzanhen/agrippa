import path, { basename } from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { bold, cyan, gray } from 'chalk';

import { cstr, joinLines, kebabCase, pascalCase } from '../utils/strings';
import { Logger } from '../logger';
import { isSubDirectory } from '../utils/isSubDirectory';
import { panic } from '../utils/panic';
import { getEnvironmentTags } from '../utils/environmentTags';
import { Config } from './Config';
import { generateReactCode } from './generateReactCode';

// Mapping of created file paths by file type
interface GeneratedPaths {
  component: string;
  styles?: string;
  dir: string;
  index?: string;
}

/**
 * Generates the files required by the CLI - in a folder or flat.
 */
export async function generateFiles(config: Config, logger: Logger): Promise<GeneratedPaths> {
  const { name, flat, typescript, styling, stylingModule, overwrite, baseDir, destination, allowOutsideBase, separateIndex, exportType } = config;


  const pcName = pascalCase(name);
  const kcName = kebabCase(name);

  const dirPath = path.resolve(baseDir ?? process.cwd(), destination, flat ? '.' : pcName);

  logger.info(
    '',
    `Generating ${bold(pcName)}`,
    '',
    `Directory: ${gray(dirPath)}`,
    `Environment: ${cyan.bold.italic(getEnvironmentTags(config))}`,
    ''
  );

  // Create the directory

  const dirName = basename(dirPath);
  if (baseDir && !isSubDirectory(baseDir, dirPath) && !allowOutsideBase) {
    logger.stage(
      'error',
      `Failed to create directory ${dirName}`,
      `The resolved directory for the component "${pcName}" falls outside the base directory:`,
      `Base directory: ${baseDir}`,
      `Resolved directory: ${dirPath}`,
      "If this is the desired behaviour, pass the '--allow-outside-base' flag or set 'allowOutsideBase: true' in .agripparc.json"
    );
    panic();
  }

  if (fs.existsSync(dirPath)) {
    logger.stage(
      'NA',
      `Directory ${dirName} already exists.`,
      gray(`path: ${dirPath}`)
    );
  }
  else {
    try {
      await fsp.mkdir(dirPath, { recursive: true });
      logger.stage(
        'success',
        `Directory ${dirName} created successfully.`,
        gray(`path: ${dirPath}`)
      );
    }
    catch (err) {
      logger.stage(
        'error',
        `Failed to create directory ${dirName}`,
        gray(`path: ${dirPath}`),
        err
      );
      panic();
    }
  }


  // Create files

  const componentFileExtension = typescript ? 'tsx' : 'jsx';
  const componentFileName = `${(flat || separateIndex) ? pcName : 'index'}.${componentFileExtension}`;
  const componentFilePath = path.join(dirPath, componentFileName);

  const stylesFileName = `${kcName}${cstr(stylingModule, '.module')}.${styling}`;
  const stylesFilePath = path.join(dirPath, stylesFileName);

  const indexFileName = `index.${typescript ? 'ts' : 'js'}`;
  const indexFilePath = path.join(dirPath, indexFileName);

  const createStylesFile = styling === 'css' || styling === 'scss';

  const willBeOverwrittenFiles = ([
    ['Component', componentFilePath, fs.existsSync(componentFilePath)],
    ['Styles', stylesFilePath, createStylesFile && fs.existsSync(stylesFilePath)],
    ['Index', indexFilePath, separateIndex && fs.existsSync(indexFilePath)]
  ] as [key: string, path: string, willBeOverwritten: boolean][])
    .filter(([, , willBeOverwritten]) => willBeOverwritten)
    .map(([key, path]) => [key, path]);

  if (!overwrite && willBeOverwrittenFiles.length !== 0) {
    willBeOverwrittenFiles.forEach(([key, path]) => logger.stage(
      'error',
      `${key} file already exists`,
      gray(`path: ${path}`),
      gray(`To allow overwriting, pass ${bold('--overwrite')} to the command.`)
    ));
    panic();
  }

  // Create component file

  try {
    await fsp.writeFile(componentFilePath, generateReactCode(config));
    logger.stage(
      'success',
      `Component File ${componentFileName} created successfully.`,
      gray(`path: ${componentFilePath}`)
    );
  }
  catch (err) {
    logger.stage(
      'error',
      `Failed to create component file ${componentFileName}`,
      gray(`path: ${componentFilePath}`),
      err
    );
    panic();
  }


  const generatedPaths: GeneratedPaths = {
    component: componentFilePath,
    dir: dirPath
  };

  // Create styles file

  if (createStylesFile) {
    try {
      await fsp.open(stylesFilePath, 'w');
      generatedPaths.styles = stylesFilePath;

      logger.stage(
        'success',
        `Styles File ${stylesFileName} created successfully.`,
        gray(`path: ${stylesFilePath}`)
      );
    }
    catch (err) {
      logger.stage(
        'error',
        `Failed to create styles file ${stylesFileName}`,
        gray(`path: ${stylesFilePath}`),
        err
      );
      panic();
    }
  }

  // Create index file

  if (separateIndex && !flat) {
    try {
      const indexFileCode = joinLines(
        `export * from './${pcName}';`,
        exportType === 'default' && `export { default } from './${pcName}';`
      );

      await fsp.writeFile(indexFilePath, indexFileCode);
      generatedPaths.index = indexFilePath;

      logger.stage(
        'success',
        `Index File ${indexFileName} created successfully.`,
        gray(`path: ${indexFilePath}`)
      );
    }
    catch (err) {
      logger.stage(
        'error',
        `Failed to create index file ${indexFileName}`,
        gray(`path: ${indexFilePath}`),
        err
      );
      panic();
    }
  }
  else if (!separateIndex && !flat) {
    // The generated component *is* the index file.
    generatedPaths.index = componentFilePath;
    logger.stage(
      'NA',
      'Generated component is the index file',
      gray(`path: ${indexFilePath}`)
    );
  }

  return generatedPaths;
}
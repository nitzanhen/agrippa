import path, { basename } from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { bold, italic } from 'chalk';
import { cstr, emptyLine, joinLines, kebabCase, pascalCase } from '../utils/strings';
import { Logger } from '../logger';
import { isSubDirectory } from '../utils/isSubDirectory';
import { panic } from '../utils/panic';
import { getEnvironmentTags } from '../utils/environmentTags';
import { styles } from '../utils/styles';
import { createImport, declareConst } from '../utils/codegenUtils';
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
    `Generating ${styles.componentName(pcName)}`,
    '',
    `Directory: ${styles.path(dirPath)}`,
    `Environment: ${styles.tag(getEnvironmentTags(config))}`,
    ''
  );

  // Create the directory

  const dirName = basename(dirPath);
  if (baseDir && !isSubDirectory(baseDir, dirPath) && !allowOutsideBase) {
    logger.stage(
      'error',
      `Failed to create directory ${italic(dirName)}`,
      styles.error(`The resolved directory for the component ${italic(pcName)} falls outside the base directory.`),
      styles.comment(`Base directory: ${italic(baseDir)}`),
      styles.comment(`Resolved directory: ${italic(dirPath)}`),
      styles.comment("To allow this behaviour, pass the '--allow-outside-base' flag or set 'allowOutsideBase: true' in .agripparc.json")
    );
    panic();
  }

  if (fs.existsSync(dirPath)) {
    logger.stage(
      'NA',
      `Directory ${italic(dirName)} already exists.`,
      styles.comment(`path: ${styles.path(dirPath)}`)
    );
  }
  else {
    try {
      await fsp.mkdir(dirPath, { recursive: true });
      logger.stage(
        'success',
        `Directory ${italic(dirName)} created successfully.`,
        styles.comment(`path: ${styles.path(dirPath)}`)
      );
    }
    catch (err) {
      logger.stage(
        'error',
        `Failed to create directory ${italic(dirName)}`,
        styles.comment(`path: ${styles.path(dirPath)}`),
        err
      );
      panic();
    }
  }


  // Create files
  const componentFileExtension = typescript ? 'tsx' : 'jsx';
  const componentFileName = `${(flat || separateIndex) ? pcName : 'index'}.${componentFileExtension}`;
  const componentFilePath = path.join(dirPath, componentFileName);

  const stylesFileName = styling === 'styled-components'
    ? `${pcName}.styles.${typescript ? 'ts' : 'js'}`
    : `${kcName}${cstr(stylingModule, '.module')}.${styling}`;

  const stylesFilePath = path.join(dirPath, stylesFileName);

  const indexFileName = `index.${typescript ? 'ts' : 'js'}`;
  const indexFilePath = path.join(dirPath, indexFileName);

  const createStylesFile = ['css', 'scss', 'styled-components'].includes(styling);

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
      styles.comment(`path: ${styles.path(path)}`),
      styles.comment(`To allow overwriting, pass ${bold('--overwrite')} to the command.`)
    ));
    panic();
  }

  // Create component file

  try {
    await fsp.writeFile(componentFilePath, generateReactCode(config));
    logger.stage(
      'success',
      `Component file ${italic(componentFileName)} created successfully.`,
      styles.comment(`path: ${componentFilePath}`)
    );
  }
  catch (err) {
    logger.stage(
      'error',
      `Failed to create component file ${italic(componentFileName)}`,
      styles.comment(`path: ${styles.path(componentFilePath)}`),
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
      const stylesFileCode = styling === 'styled-components'
        ? joinLines(
          createImport('styled-components', 'default', 'styled'),
          emptyLine(),
          declareConst('Root', 'styled.button``', true)
        )
        : '';

      await fsp.writeFile(stylesFilePath, stylesFileCode);
      generatedPaths.styles = stylesFilePath;

      logger.stage(
        'success',
        `Styles file ${italic(stylesFileName)} created successfully.`,
        styles.comment(`path: ${styles.path(stylesFilePath)}`)
      );
    }
    catch (err) {
      logger.stage(
        'error',
        `Failed to create styles file ${italic(stylesFileName)}`,
        styles.comment(`path: ${styles.path(stylesFilePath)}`),
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
        `Index file ${italic(indexFileName)} created successfully.`,
        styles.comment(`path: ${styles.path(indexFilePath)}`)
      );
    }
    catch (err) {
      logger.stage(
        'error',
        `Failed to create index file ${italic(indexFileName)}`,
        styles.comment(`path: ${styles.path(indexFilePath)}`),
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
      styles.comment(`path: ${styles.path(indexFilePath)}`)
    );
  }

  return generatedPaths;
}
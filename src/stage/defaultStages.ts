import { join, resolve } from 'path';
import { AgrippaFile } from '../AgrippaFile';
import { Config } from '../Config';
import { joinLines } from '../utils/strings';
import { createDir } from './createDir';
import { Stage } from './Stage';

const getDirPath = ({ baseDir, destination, name }: Config) => resolve(baseDir ?? process.cwd(), destination, name);

export function defaultIndexFile(config: Config): AgrippaFile {
  const { name, componentFileOptions: { exportType }, typescript } = config;

  const dirPath = getDirPath(config);

  const fileName = `index.${typescript ? 'ts' : 'js'}`;
  const path = join(dirPath, fileName);

  const code = joinLines(
    `export * from './${name}';`,
    exportType === 'default' && `export { default } from './${name}';`
  );

  return new AgrippaFile(path, code);
}

export function defaultStages(config: Config): Stage[] {
  const { name, kebabName, typescript, styling, styleFileOptions } = config;

  const dirPath = getDirPath(config);

  const componentFileExtension = typescript ? 'tsx' : 'jsx';
  const componentFileName = `${name}.${componentFileExtension}`;
  const componentFilePath = join(dirPath, componentFileName);

  const stylesFileName = styling === 'styled-components'
    ? `${name}.styles.${typescript ? 'ts' : 'js'}`
    : `${kebabName}${styleFileOptions?.module ? '.module' : ''}.${styling}`;

  const stylesFilePath = join(dirPath, stylesFileName);

  /** @todo replace with config flag (with default value set to this) */
  const createStylesFile = ['css', 'scss', 'styled-components'].includes(styling);


  return [
    ...createDir({
      path: dirPath,
      files: [
        new AgrippaFile(componentFilePath, 'c'),
        createStylesFile && new AgrippaFile(stylesFilePath, ''),
        defaultIndexFile(config)

      ].filter((f): f is AgrippaFile => !!f)
    })
  ];
}
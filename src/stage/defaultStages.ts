import { join, resolve } from 'path';
import { AgrippaFile } from '../AgrippaFile';
import { Config } from '../Config';
import type { RunOptions } from '../run';
import { createDir } from './createDir';
import { Stage } from './Stage';

export interface defaultStagesOptions {
  envFiles: Record<string, any>;
  config: Config;
}

export function defaultStages(options: RunOptions): Stage[] {
  const { config, envFiles } = options;
  const { baseDir, destination, flat, name, kebabName, typescript, styling } = config;

  const dirPath = resolve(baseDir ?? process.cwd(), destination, flat ? '.' : name);

  const componentFileExtension = typescript ? 'tsx' : 'jsx';
  const componentFileName = `${(flat || separateIndex) ? name : 'index'}.${componentFileExtension}`;
  const componentFilePath = join(dirPath, componentFileName);

  const stylesFileName = styling === 'styled-components'
    ? `${name}.styles.${typescript ? 'ts' : 'js'}`
    : `${kebabName}${stylingModule ? '.module' : ''}.${styling}`;

  const stylesFilePath = join(dirPath, stylesFileName);

  const indexFileName = `index.${typescript ? 'ts' : 'js'}`;
  const indexFilePath = join(dirPath, indexFileName);

  const createStylesFile = ['css', 'scss', 'styled-components'].includes(styling);

  return [
    ...createDir({
      path: dirPath,
      files: [
        new AgrippaFile(componentFilePath, 'c'),
        createStylesFile && new AgrippaFile(stylesFilePath, ''),
        new AgrippaFile('./index.ts', 'a'),

      ].filter((f): f is AgrippaFile => !!f)
    })
  ];
}
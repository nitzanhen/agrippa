import { join, resolve } from 'path';
import { CodeComposer, ImportPlugin, PreactPlugin, PropTypesPlugin, ReactNativePlugin, ReactPlugin, SolidPlugin } from '../composer';
import { Config, Environment } from '../config';
import { joinLines } from '../utils/strings';
import { AgrippaFile } from './AgrippaFile';
import { createDir } from './createDir';
import { createFile } from './createFile';
import { Stage } from './Stage';

const getDirPath = ({ baseDir, destination, name }: Config) => resolve(baseDir ?? process.cwd(), destination, name);

export const getEnvironmentPlugin = (config: Config) => {
  switch (config.environment) {
    case Environment.REACT: return new ReactPlugin(config);
    case Environment.REACT_NATIVE: return new ReactNativePlugin(config);
    case Environment.SOLIDJS: return new SolidPlugin(config);
    case Environment.PREACT: return new PreactPlugin(config);
    default: return null;
  }
};

export function defaultComponentFile(config: Config, styleFilePath?: string): AgrippaFile {
  const { name, typescript } = config;

  const dirPath = getDirPath(config);

  const componentFileExtension = typescript ? 'tsx' : 'jsx';
  const componentFileName = `${name}.${componentFileExtension}`;
  const componentFilePath = join(dirPath, componentFileName);

  const composer = new CodeComposer(config);

  const environmentPlugin = getEnvironmentPlugin(config);
  if (environmentPlugin) {
    composer.addPlugin(environmentPlugin);
  }
  if (styleFilePath) {
    composer.addPlugin(new ImportPlugin({
      module: styleFilePath,
      defaultImport: config.styleFileOptions?.module ? 'classes' : undefined
    }));
  }

  if (config.reactOptions?.propTypes) {
    composer.addPlugin(new PropTypesPlugin());
  }

  return new AgrippaFile(componentFilePath, composer.compose());
}

export function defaultIndexFile(config: Config): AgrippaFile {
  const { name, componentOptions: { exportType }, typescript } = config;

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
  const { name, kebabName, typescript, styling, styleFileOptions, createStylesFile } = config;

  const dirPath = getDirPath(config);

  const stylesFileName = styling === 'styled-components'
    ? `${name}.styles.${typescript ? 'ts' : 'js'}`
    : `${kebabName}${styleFileOptions?.module ? '.module' : ''}.${styling}`;

  const stylesFilePath = join(dirPath, stylesFileName);

  return [
    createDir({
      path: dirPath,
      varKey: 'dirPath'
    }),
    createFile({
      file: defaultComponentFile(config, createStylesFile ? `./${stylesFileName}` : undefined),
      varKey: 'componentPath'
    }),
    createStylesFile && createFile({
      file: new AgrippaFile(stylesFilePath, ''),
      varKey: 'stylesPath'
    }),
    createFile({
      file: defaultIndexFile(config),
      varKey: 'indexPath'
    })
  ].filter((f): f is Stage => !!f);
}
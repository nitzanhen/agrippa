import { join, resolve } from 'path';
import { CodeComposer, ImportPlugin, PreactPlugin, PropTypesPlugin, ReactNativePlugin, ReactPlugin, SolidPlugin } from '../composer';
import { Options, Environment } from '../options';
import { joinLines } from '../utils/strings';
import { AgrippaDir } from './AgrippaDir';
import { AgrippaFile } from './AgrippaFile';
import { CreateDirStage } from './CreateDirStage';
import { CreateFileStage } from './CreateFileStage';
import { Stage } from './Stage';

const getDirPath = ({ baseDir, destination, name }: Options) => resolve(baseDir ?? process.cwd(), destination, name);

export const getEnvironmentPlugin = (options: Options) => {
  switch (options.environment) {
    case Environment.REACT: return new ReactPlugin(options);
    case Environment.REACT_NATIVE: return new ReactNativePlugin(options);
    case Environment.SOLIDJS: return new SolidPlugin(options);
    case Environment.PREACT: return new PreactPlugin(options);
    default: return null;
  }
};

export function defaultComponentFile(options: Options, styleFilePath?: string): AgrippaFile {
  const { name, typescript } = options;

  const dirPath = getDirPath(options);

  const componentFileExtension = typescript ? 'tsx' : 'jsx';
  const componentFileName = `${name}.${componentFileExtension}`;
  const componentFilePath = join(dirPath, componentFileName);

  const composer = new CodeComposer(options);

  const environmentPlugin = getEnvironmentPlugin(options);
  if (environmentPlugin) {
    composer.addPlugin(environmentPlugin);
  }
  if (styleFilePath) {
    composer.addPlugin(new ImportPlugin({
      module: styleFilePath,
      defaultImport: options.styleFileOptions?.module ? 'classes' : undefined
    }));
  }

  if (options.reactOptions?.propTypes) {
    composer.addPlugin(new PropTypesPlugin());
  }

  return new AgrippaFile(componentFilePath, composer.compose());
}

export function defaultIndexFile(options: Options): AgrippaFile {
  const { name, componentOptions: { exportType }, typescript } = options;

  const dirPath = getDirPath(options);

  const fileName = `index.${typescript ? 'ts' : 'js'}`;
  const path = join(dirPath, fileName);

  const code = joinLines(
    `export * from './${name}';`,
    exportType === 'default' && `export { default } from './${name}';`
  );

  return new AgrippaFile(path, code);
}

export function defaultStages(options: Options): Stage[] {
  const { name, kebabName, typescript, styling, styleFileOptions, createStylesFile } = options;

  const dirPath = getDirPath(options);

  const stylesFileName = styling === 'styled-components'
    ? `${name}.styles.${typescript ? 'ts' : 'js'}`
    : `${kebabName}${styleFileOptions?.module ? '.module' : ''}.${styling}`;

  const stylesFilePath = join(dirPath, stylesFileName);

  return ([
    new CreateDirStage({
      dir: new AgrippaDir(dirPath),
      varKey: 'dirPath'
    }),
    new CreateFileStage({
      file: defaultComponentFile(options, createStylesFile ? `./${stylesFileName}` : undefined),
      varKey: 'componentPath'
    }),
    createStylesFile && new CreateFileStage({
      file: new AgrippaFile(stylesFilePath, ''),
      varKey: 'stylesPath'
    }),
    new CreateFileStage({
      file: defaultIndexFile(options),
      varKey: 'indexPath'
    })
  ] as (Stage | boolean)[]
  ).filter((f): f is Stage => !!f);
}
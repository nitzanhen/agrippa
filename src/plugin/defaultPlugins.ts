import { join, resolve } from 'path';
import { CodeComposer, ImportPlugin, PreactPlugin, PropTypesPlugin, ReactNativePlugin, ReactPlugin, SolidPlugin } from '../composer';
import { Logger } from '../logger';
import { Framework, Options } from '../options';
import { AgrippaDir, AgrippaFile } from '../stage';
import { joinLines } from '../utils';
import { getStackTags } from '../utils/getStackTags';
import { CreateDirPlugin } from './CreateDirPlugin';
import { CreateFilePlugin } from './CreateFilePlugin';
import { Plugin } from './Plugin';
import { StackTagPlugin } from './StackTagPlugin';

const getDirPath = ({ baseDir, destination, name }: Options) => resolve(baseDir ?? process.cwd(), destination, name);

export const getFrameworkPlugin = (options: Options, logger: Logger) => {
  switch (options.framework) {
    case Framework.REACT: return new ReactPlugin(options);
    case Framework.REACT_NATIVE: return new ReactNativePlugin(options);
    case Framework.SOLIDJS: return new SolidPlugin(options);
    case Framework.PREACT: return new PreactPlugin(options);
    default: {
      logger.warn(
        '',
        'No framework flag was received, and Agrippa was unable to detect the framework automatically. Please check your configuration.',
      );
      return null;
    };
  }
};

export function defaultComponentFile(options: Options, logger: Logger, styleFilePath?: string): AgrippaFile {
  const { name, typescript } = options;

  const dirPath = getDirPath(options);

  const componentFileExtension = typescript ? 'tsx' : 'jsx';
  const componentFileName = `${name}.${componentFileExtension}`;
  const componentFilePath = join(dirPath, componentFileName);

  const composer = new CodeComposer(options);

  const frameworkPlugin = getFrameworkPlugin(options, logger);
  if (frameworkPlugin) {
    composer.addPlugin(frameworkPlugin);
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

export function defaultPlugins(options: Options, logger: Logger): Plugin[] {
  const { name, kebabName, typescript, styling, styleFileOptions, createStylesFile } = options;

  const dirPath = getDirPath(options);

  const stylesFileName = styling === 'styled-components'
    ? `${name}.styles.${typescript ? 'ts' : 'js'}`
    : `${kebabName}${styleFileOptions?.module ? '.module' : ''}.${styling}`;

  const stylesFilePath = join(dirPath, stylesFileName);

  return ([
    /** @todo find a good way to do this from the plugins, not add a dedicated one */
    new StackTagPlugin(
      getStackTags(options)
    ),
    new CreateDirPlugin({
      dir: new AgrippaDir(dirPath),
      varKey: 'dirPath'
    }),
    new CreateFilePlugin({
      file: defaultComponentFile(options, logger, createStylesFile ? `./${stylesFileName}` : undefined),
      varKey: 'componentPath'
    }),
    createStylesFile && new CreateFilePlugin({
      file: new AgrippaFile(stylesFilePath, ''),
      varKey: 'stylesPath'
    }),
    new CreateFilePlugin({
      file: defaultIndexFile(options),
      varKey: 'indexPath'
    })
  ] as (Plugin | boolean)[]
  ).filter((p): p is Plugin => !!p);
}
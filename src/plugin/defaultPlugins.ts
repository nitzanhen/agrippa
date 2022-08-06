import { join, resolve } from 'path';
import { CodeComposer, Import, ImportPlugin, PreactPlugin, PropTypesPlugin, ReactNativePlugin, ReactPlugin, SolidPlugin } from '../composer';
import { Logger } from '../logger';
import { Framework, Options, Styling } from '../options';
import { AgrippaDir, AgrippaFile } from '../stage';
import { joinLines, kebabCase } from '../utils';
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

export function defaultStyleFileImport(options: Options, logger: Logger, styleFileName: string): Import | undefined {
  const { styling, name, styleFileOptions } = options;

  if (styling === Styling.CSS || styling === Styling.SCSS) {
    return {
      module: `./${styleFileName}`,
      defaultImport: styleFileOptions?.module ? 'classes' : undefined
    };
  }
  if (styling === Styling.STYLED_COMPONENTS) {
    return {
      module: `${name}.styles`,
      namedImports: ['Root']
    };
  }

  logger.debug(`defaultStyleFileImport called for unknown styling option, ${styling}`);
  return undefined;
}

export function defaultComponentFile(options: Options, logger: Logger, additionalImports?: Import[]): AgrippaFile {
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
  additionalImports?.map(i => {
    composer.addPlugin(new ImportPlugin(i));
  });

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
  const { name, typescript, styling, styleFileOptions, createStylesFile } = options;

  const dirPath = getDirPath(options);

  const stylesFileName = styling === 'styled-components'
    ? `${name}.styles.${typescript ? 'ts' : 'js'}`
    : `${kebabCase(name)}${styleFileOptions?.module ? '.module' : ''}.${styling}`;

  const stylesFilePath = join(dirPath, stylesFileName);

  const styleFileImport = createStylesFile
    ? defaultStyleFileImport(options, logger, stylesFileName)
    : undefined;

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
      file: defaultComponentFile(options, logger, styleFileImport && [styleFileImport]),
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
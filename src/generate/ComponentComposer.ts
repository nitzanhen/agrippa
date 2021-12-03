import { cstr, emptyLine, indent, joinLines, kebabCase, pascalCase } from '../utils/strings';
import { createArrowFunction, createAssignment, createComment, createDefaultExport, createImport, declareConst, declareFunction, declareInterface, declareType } from '../utils/codegenUtils';

import { logger } from '../logger';
import { Config } from './Config';

/**
 * Contains all logic for composing code segments.
 * @see https://github.com/NitzanHen/agrippa/issues/9
 */
export class ComponentComposer {
  constructor(private readonly config: Config) { }

  get componentName() {
    return pascalCase(this.config.name);
  }

  get propInterfaceName() {
    return `${this.componentName}Props`;
  }

  get styleFileName() {
    return kebabCase(this.config.name);
  }

  getComponentParams(includeType: boolean = false) {
    if (includeType) {
      return `${this.config.children ? '{ children }' : 'props'}: ${this.propInterfaceName}`;
    }

    return this.config.children ? '{ children }' : '';
  }

  getJSX() {
    const { reactNative } = this.config;
    const comp = !reactNative ? 'div' : 'View';

    return `<${comp}>${cstr(this.config.children, '{children}')}</${comp}>`;
  };

  getComponentBody() {
    const { styling } = this.config;

    const callStyleHook = styling === 'jss' || styling === 'mui';

    return joinLines(
      emptyLine(),
      callStyleHook && (declareConst('classes', 'useStyles()') + '\n'),
      'return (',
      indent(this.getJSX()),
      ');'
    );
  }

  getComponentType() {
    return `React.${this.config.children ? 'FC' : 'VFC'}<${this.propInterfaceName}>`;
  }

  getStyleFileImport() {
    const { stylingModule, styling } = this.config;

    return stylingModule
      ? createImport(`./${this.styleFileName}.module.${styling}`, 'default', 'classes')
      : createImport(`./${this.styleFileName}.${styling}`);
  }

  getReactImport() {
    if (this.config.memo) {
      return this.config.importReact
        ? createImport('react', 'composite', ['React', 'memo'])
        : createImport('react', 'named', 'memo');
    }

    return createImport('react', 'default', 'React');
  }

  getImportBlock() {
    const { props, importReact, styling, memo, reactNative } = this.config;
    const isStylesFileCreated = styling === 'css' || styling === 'scss';
    const createReactImport = importReact || memo;

    return joinLines(
      props === 'jsdoc' && '//@ts-check',
      createReactImport && this.getReactImport(),
      styling === 'jss' && createImport('react-jss', 'named', 'createUseStyles'),
      styling === 'mui' && createImport('@material-ui/core', 'named', 'makeStyles'),
      props === 'prop-types' && createImport('prop-types', 'default', 'PropTypes'),
      isStylesFileCreated && (emptyLine() + this.getStyleFileImport()),
      reactNative && createImport(
        'react-native',
        'named',
        styling === 'react-native' ? ['View', 'StyleSheet'] : ['View']
      )
    );
  }

  get TSProps() {
    const { typescript, props } = this.config;
    return typescript && props === 'ts';
  }
  getPropInterfaceDeclaration() {
    const { typescript } = this.config;
    if (!typescript) {
      logger.debug('getPropInterfaceDeclaration() called but typescript is false. This shouldn\'t be possible.');
    }

    const propsDeclaration = this.config.tsPropsDeclaration as 'type' | 'interface';

    return propsDeclaration === 'type'
      ? declareType(this.propInterfaceName, true)
      : declareInterface(this.propInterfaceName, true);
  }

  getComponentConstDeclaration() {
    return declareConst(
      this.componentName,
      createArrowFunction(
        this.getComponentParams(),
        this.getComponentBody()
      ),
      this.config.exportType === 'named',
      this.TSProps ? this.getComponentType() : undefined
    );
  }

  getComponentFunctionDeclaration() {
    return declareFunction(
      this.componentName,
      this.getComponentParams(this.TSProps),
      this.getComponentBody(),
      this.config.exportType === 'named'
    );
  }

  getComponentMemoDeclaration() {
    const memoBase = this.TSProps ? `memo<${this.propInterfaceName}>` : 'memo';
    const createMemo = (component: string) => `${memoBase}(${component})`;

    return declareConst(
      this.componentName,
      createMemo(
        declareFunction(
          this.componentName,
          this.getComponentParams(),
          this.getComponentBody()
        )
      ),
      this.config.exportType === 'named',
      this.TSProps ? this.getComponentType() : undefined
    );
  }

  getComponentDeclaration() {
    const { memo, declaration } = this.config;

    if (memo) {
      return this.getComponentMemoDeclaration();
    }

    return declaration === 'const'
      ? this.getComponentConstDeclaration()
      : this.getComponentFunctionDeclaration();
  }

  get createCSSInJSBlock() {
    const { styling } = this.config;
    return ['jss', 'mui', 'react-native'].includes(styling);
  }

  getCSSInJSBlock() {
    const { styling } = this.config;

    return ({
      'mui': declareConst('useStyles', 'makeStyles(theme => {})'),
      'jss': declareConst('useStyles', 'createUseStyles({})'),
      'react-native': declareConst('styles', 'StyleSheet.create({})')
    } as Record<string, string>)[styling] ?? null;
  }

  getJSDocBlock() {
    return joinLines(
      createComment('jsdoc', `@typedef ${this.propInterfaceName}`),
      emptyLine(),
      createComment('jsdoc', `@type {${this.getComponentType()}}`)
    );
  }

  getPropTypesBlock() {
    return createAssignment(this.componentName, 'propTypes', '{}');
  }

  getDefaultExport() {
    return createDefaultExport(this.componentName);
  }

  compose() {
    const { props, exportType, styling } = this.config;

    const stylesAboveComponent = this.createCSSInJSBlock && styling !== 'react-native';
    const stylesBelowComponent = this.createCSSInJSBlock && styling === 'react-native';

    return joinLines(
      this.getImportBlock() || false,
      emptyLine(),

      stylesAboveComponent && (this.getCSSInJSBlock()! + '\n'),

      this.TSProps && (this.getPropInterfaceDeclaration() + '\n'),

      props === 'jsdoc' && this.getJSDocBlock(),

      this.getComponentDeclaration(),
      emptyLine(),

      stylesBelowComponent && (this.getCSSInJSBlock()! + '\n'),

      props === 'prop-types' && (this.getPropTypesBlock() + '\n'),
      exportType === 'default' && this.getDefaultExport()
    );
  }
}

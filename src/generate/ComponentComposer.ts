import { cstr, emptyLine, indent, joinLines, kebabCase, pascalCase } from '../utils/strings';
import { createArrowFunction, createAssignment, createComment, createDefaultExport, createImport, declareConst, declareInterface } from '../utils/codegenUtils';

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

  getComponentParams() {
    return cstr(this.config.children, '{ children }');
  }

  getJSX() {
    return this.config.children ? '<div>{children}</div>' : '<div />';
  };

  getComponentBody() {
    const { styling } = this.config;

    const callStyleHook = styling === 'jss' || styling === 'mui';

    return joinLines(
      emptyLine(),
      callStyleHook && declareConst('classes', 'useStyles()') + '\n',
      'return (',
      indent(this.getJSX()),
      ');'
    );
  }

  getComponentType() {
    return `React.${this.config.children ? 'FC' : 'VFC'}<${this.propInterfaceName}>`;
  }

  getStylesImport() {
    const { stylingModule, styling } = this.config;

    return stylingModule
      ? createImport(`./${this.styleFileName}.module.${styling}`, 'classes', 'default')
      : createImport(`./${this.styleFileName}.${styling}`);
  }

  getImportBlock() {
    const { props, importReact, styling } = this.config;
    const isStylesFileCreated = styling === 'css' || styling === 'mui';

    return joinLines(
      props === 'jsdoc' && '//@ts-check',
      importReact && createImport('react', 'React', 'default'),
      styling === 'jss' && createImport('react-jss', 'createUseStyles', 'named'),
      styling === 'mui' && createImport('@material-ui/core', 'makeStyles', 'named'),
      props === 'prop-types' && createImport('prop-types', 'PropTypes', 'default'),
      emptyLine(),
      isStylesFileCreated && this.getStylesImport(),
    );
  }

  getComponentDeclaration() {
    return declareConst(
      this.componentName,
      createArrowFunction(
        this.getComponentParams(),
        this.getComponentBody()
      ),
      this.config.exportType === 'named',
      this.config.typescript ? this.getComponentType() : undefined
    );
  }

  get createUseStylesBlock() {
    const { styling } = this.config;
    return styling === 'jss' || styling === 'mui';
  }

  getUseStylesBlock() {
    if (!this.createUseStylesBlock) {
      return null;
    }

    return declareConst(
      'useStyles',
      this.config.styling === 'mui' ? 'makeStyles(theme => {})' : 'createUseStyles({})'
    );
  }


  get createTSProps() {
    const { typescript, props } = this.config;
    return typescript && props === 'ts';
  }
  getPropInterfaceDeclaration() {
    return declareInterface(this.propInterfaceName, true);
  }

  getJSDocBlock() {
    return joinLines(
      createComment('jsdoc', `@typedef {${this.propInterfaceName}}`),
      emptyLine(),
      createComment('jsdoc', `@type ${this.getComponentType()}`)
    );
  }

  getPropTypesBlock() {
    return createAssignment(this.componentName, 'propTypes', '{}');
  }

  getDefaultExport() {
    return createDefaultExport(this.componentName);
  }

  compose() {
    const { props, exportType } = this.config;

    return joinLines(
      this.getImportBlock(),
      emptyLine(),

      this.createUseStylesBlock && this.getUseStylesBlock()! + '\n',

      this.createTSProps && this.getPropInterfaceDeclaration() + '\n',

      props === 'jsdoc' && this.getJSDocBlock() + '\n',

      this.getComponentDeclaration(),
      emptyLine(),

      props === 'prop-types' && this.getPropTypesBlock() + '\n',
      exportType === 'default' && this.getDefaultExport()
    );
  }
}
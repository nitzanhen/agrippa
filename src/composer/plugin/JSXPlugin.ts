import { Options } from '../../options';
import { indent, joinLines } from '../../utils';
import { createArrowFunction, createDefaultExport, declareConst, declareFunction, declareInterface, declareType } from '../../utils/codegen';
import { Blocks } from '../Blocks';
import { Imports } from '../Imports';
import { ComposerPlugin } from './ComposerPlugin';

/** @todo find a better place for these */
export const DECLARATION_BLOCK_KEY = 'declaration';
export const DECLARATION_BLOCK_PRECEDENCE = 10;

export const TS_PROPS_BLOCK_KEY = 'ts-prop-declaration';
export const TS_PROPS_BLOCK_PRECEDENCE = 5;

export const DEFAULT_EXPORT_BLOCK_KEY = 'default-export';
export const DEFAULT_EXPORT_BLOCK_PRECEDENCE = 20;

/**
 * Base composer plugin for JSX components.
 */
export abstract class JSXPlugin implements ComposerPlugin {
  abstract readonly id?: string;
  abstract rootTag: string;

  protected typescriptOptions: Options['typescriptOptions'];

  constructor(protected options: Options) {
    const { typescript, typescriptOptions } = options;

    if (typescript && !typescriptOptions) {
      throw TypeError('JSXPlugin requires Options.typescriptOptions to be set whenever Options.typescript is set');
    }

    this.typescriptOptions = typescriptOptions;
  }

  abstract declareImports(imports: Imports): void;

  get propInterfaceName() {
    return this.options.name + 'Props';
  }

  getComponentParams() {
    return this.options.typescript ? `props: ${this.propInterfaceName}` : 'props';
  }

  getComponentBody() {

    return joinLines(
      '',
      'return (',
      indent(`<${this.rootTag}></${this.rootTag}>`),
      ');'
    );
  }

  getTSPropsDeclaration() {
    const { typescript } = this.options;
    if (!typescript) {
      throw new Error('getTSPropsDeclaration() called but typescript is false. This shouldn\'t be possible.');
    }

    const { propDeclaration } = this.typescriptOptions!;

    switch (propDeclaration) {
      case 'type': return declareType(this.propInterfaceName, true);
      case 'interface': return declareInterface(this.propInterfaceName, true);
      default: return null;
    }
  }

  getComponentConstDeclaration() {
    const { name, componentOptions: { exportType } } = this.options;

    return declareConst(
      name,
      createArrowFunction(
        this.getComponentParams(),
        this.getComponentBody()
      ),
      exportType === 'named'
    );
  }


  getComponentFunctionDeclaration() {
    const { name, componentOptions: { exportType } } = this.options;

    return declareFunction(
      name,
      this.getComponentParams(),
      this.getComponentBody(),
      exportType === 'named'
    );
  }

  getComponentDeclaration(): string {
    const { componentOptions: { declaration } } = this.options;

    return declaration === 'const'
      ? this.getComponentConstDeclaration()
      : this.getComponentFunctionDeclaration();
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  onCompose(blocks: Blocks, imports: Imports, options: Options): void {
    const { typescript, componentOptions: { exportType }, name } = this.options;

    this.declareImports(imports);

    if (typescript) {
      const propsDeclaration = this.getTSPropsDeclaration();
      if (propsDeclaration) {
        blocks.add({
          key: TS_PROPS_BLOCK_KEY,
          precedence: TS_PROPS_BLOCK_PRECEDENCE,
          data: propsDeclaration
        });
      }
    }

    blocks.add({
      key: DECLARATION_BLOCK_KEY,
      precedence: DECLARATION_BLOCK_PRECEDENCE,
      data: this.getComponentDeclaration()
    });

    if (exportType === 'default') {
      blocks.add({
        key: DEFAULT_EXPORT_BLOCK_KEY,
        precedence: DEFAULT_EXPORT_BLOCK_PRECEDENCE,
        data: createDefaultExport(name)
      });
    }
  }
}
import { Config } from '../../config';
import { indent, joinLines } from '../../utils';
import { createArrowFunction, declareConst, declareFunction, declareInterface, declareType } from '../../utils/codegen';
import { Blocks } from '../Blocks';
import { Imports } from '../Imports';
import { ComposerPlugin } from './ComposerPlugin';

/** @todo find a better place for these */
const DECLARATION_BLOCK_KEY = 'declaration';
const DECLARATION_BLOCK_PRECEDENCE = 10;

const TS_PROPS_BLOCK_KEY = 'ts-prop-declaration';
const TS_PROPS_BLOCK_PRECEDENCE = 5;

/**
 * Base composer plugin for JSX components.
 */
export abstract class JSXPlugin implements ComposerPlugin {
  abstract readonly id?: string;
  abstract rootTag: string;

  protected typescriptOptions: Config['typescriptOptions'];

  constructor(protected config: Config) {
    const { typescriptOptions } = config;

    if (!typescriptOptions) {
      throw TypeError('JSXPlugin requires Config.typescriptOptions to be set whenever Config.typescript is set');
    }

    this.typescriptOptions = typescriptOptions;
  }

  abstract declareImports(imports: Imports): void;

  get propInterfaceName() {
    return this.config.name + 'Props';
  }

  getComponentParams() {
    return this.config.typescript ? `props: ${this.propInterfaceName}` : 'props';
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
    const { typescript } = this.config;
    if (!typescript) {
      /** @todo */
      //logger.debug('getPropInterfaceDeclaration() called but typescript is false. This shouldn\'t be possible.');
      return null;
    }

    const { propDeclaration } = this.typescriptOptions!;

    switch (propDeclaration) {
      case 'type': return declareType(this.propInterfaceName, true);
      case 'interface': return declareInterface(this.propInterfaceName, true);
      default: return null;
    }
  }

  getComponentConstDeclaration() {
    const { name, componentOptions: { exportType } } = this.config;

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
    const { name, componentOptions: { exportType } } = this.config;

    return declareFunction(
      name,
      this.getComponentParams(),
      this.getComponentBody(),
      exportType === 'named'
    );
  }

  getComponentDeclaration(): string {
    const { componentOptions: { declaration } } = this.config;

    return declaration === 'const'
      ? this.getComponentConstDeclaration()
      : this.getComponentFunctionDeclaration();
  }


  onCompose(blocks: Blocks, imports: Imports): void {
    const { typescript } = this.config;

    this.declareImports(imports);

    if (typescript) {
      blocks.add({
        key: TS_PROPS_BLOCK_KEY,
        precedence: TS_PROPS_BLOCK_PRECEDENCE,
        data: this.getTSPropsDeclaration()!
      });
    }

    blocks.add({
      key: DECLARATION_BLOCK_KEY,
      precedence: DECLARATION_BLOCK_PRECEDENCE,
      data: this.getComponentDeclaration()
    });
  }
}
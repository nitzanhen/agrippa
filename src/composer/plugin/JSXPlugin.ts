import { Config } from '../../Config';
import { indent, joinLines } from '../../utils';
import { createArrowFunction, declareConst, declareFunction } from '../../utils/codegen';
import { Blocks } from '../Blocks';
import { Imports } from '../Imports';
import { ComposerPlugin } from './ComposerPlugin';

/** @todo find a better place for these */
const DECLARATION_BLOCK_KEY = 'declaration';
const DECLARATION_BLOCK_PRECEDENCE = 10;

/**
 * Base composer plugin for JSX components.
 */
export abstract class JSXPlugin implements ComposerPlugin {
  abstract rootTag: string;

  abstract readonly id?: string;

  constructor(protected config: Config) { }

  abstract declareImports(imports: Imports): void;

  getComponentParams() {
    //return `props: ${this.propsInterfaceName}`;
    return 'props';
  }

  getComponentBody() {

    return joinLines(
      '',
      'return (',
      indent(`<${this.rootTag}></${this.rootTag}>`),
      ');'
    );
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
    this.declareImports(imports);

    blocks.add({
      key: DECLARATION_BLOCK_KEY,
      precedence: DECLARATION_BLOCK_PRECEDENCE,
      data: this.getComponentDeclaration()
    });
  }
}
import { Config } from '../../Config';
import { indent, joinLines } from '../../utils';
import { createArrowFunction, declareConst, declareFunction } from '../../utils/codegen';
import { Blocks } from '../Blocks';
import { Imports } from '../Imports';
import { ComposerPlugin } from './ComposerPlugin';

/** @todo doc */
export class ReactPlugin implements ComposerPlugin {
  key = 'react';
  rootTag = 'div';
  

  constructor(protected config: Config) { }

  /** @todo figure out the correct place/manner to provide TS functionality */
  // get propsInterfaceName() {
  //   return this.config.name + 'Props';
  // }

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

  getComponentDeclaration() {
    const { componentOptions: { declaration } } = this.config;

    return declaration === 'const'
      ? this.getComponentConstDeclaration()
      : this.getComponentFunctionDeclaration();
  }

  onCompose(blocks: Blocks, imports: Imports) {
    const options = this.config.reactOptions!;
    if (options.importReact) {
      imports.add({ module: 'react', importType: 'default', importAs: 'React' });
    }

    const declaration = this.getComponentDeclaration();

    blocks.add({
      key: 'declaration',
      precedence: 10, /** @todo replace with some constant, somewhere */
      data: declaration,
    });
  }
}
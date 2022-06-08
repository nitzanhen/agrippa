import { Options } from '../../options';
import { Imports } from '../Imports';
import { JSXPlugin } from './JSXPlugin';

/** 
 * ComponentComposer plugin for React components.
 */
export class ReactPlugin extends JSXPlugin {
  readonly id = 'react';
  rootTag = 'div';

  private reactOptions: NonNullable<Options['reactOptions']>;

  constructor(protected options: Options) {
    super(options);

    const { reactOptions } = options;
    if (!reactOptions) {
      throw TypeError('ReactPlugin requires Options.reactOptions to be set');
    }

    this.reactOptions = reactOptions;
  }

  declareImports(imports: Imports): void {
    if (this.reactOptions.importReact) {
      imports.add({ module: 'react', defaultImport: 'React' });
    }
  }
}
import { Config } from '../../Config';
import { Imports } from '../Imports';
import { JSXPlugin } from './JSXPlugin';

/** 
 * ComponentComposer plugin for React components.
 */
export class ReactPlugin extends JSXPlugin {
  readonly id = 'react';
  rootTag = 'div';

  private reactOptions: NonNullable<Config['reactOptions']>;

  constructor(protected config: Config) {
    super(config);

    const { reactOptions } = config;
    if (!reactOptions) {
      throw TypeError('ReactPlugin requires Config.reactOptions to be set');
    }

    this.reactOptions = reactOptions;
  }

  declareImports(imports: Imports): void {
    if (this.reactOptions.importReact) {
      imports.add({ module: 'react', defaultImport: 'React' });
    }
  }
}
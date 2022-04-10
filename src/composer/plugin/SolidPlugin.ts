import { Config } from '../../Config';
import { Imports } from '../Imports';
import { JSXPlugin } from './JSXPlugin';

export class SolidPlugin extends JSXPlugin {
  id = 'solidjs';
  rootTag = 'div';

  private solidjsOptions: NonNullable<Config['solidjsOptions']>;

  constructor(protected config: Config) {
    super(config);

    const solidjsOptions = config.solidjsOptions;
    if(!solidjsOptions) {
      throw TypeError('SolidPlugin requires Config.solidjsOptions to be set');
    }

    this.solidjsOptions = solidjsOptions;
  }

  declareImports(): void {}
}
import { Options } from '../../options';
import { JSXPlugin } from './JSXPlugin';

export class SolidPlugin extends JSXPlugin {
  readonly id = 'solidjs';
  rootTag = 'div';

  private solidjsOptions: NonNullable<Options['solidjsOptions']>;

  constructor(protected options: Options) {
    super(options);

    const solidjsOptions = options.solidjsOptions;
    if (!solidjsOptions) {
      throw TypeError('SolidPlugin requires Options.solidjsOptions to be set');
    }

    this.solidjsOptions = solidjsOptions;
  }

  declareImports(): void { }
}
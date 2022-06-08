import { Options } from '../../options';
import { JSXPlugin } from './JSXPlugin';

export class PreactPlugin extends JSXPlugin {
  readonly id = 'preact';
  rootTag = 'div';

  private preactOptions: NonNullable<Options['preactOptions']>;

  constructor(protected options: Options) {
    super(options);

    const preactOptions = options.preactOptions;
    if (!preactOptions) {
      throw TypeError('PreactPlugin requires Options.preactOptions to be set');
    }

    this.preactOptions = preactOptions;
  }

  declareImports(): void { }
}
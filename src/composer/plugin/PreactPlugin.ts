import { Config } from '../../config';
import { JSXPlugin } from './JSXPlugin';

export class PreactPlugin extends JSXPlugin {
  readonly id = 'preact';
  rootTag = 'div';

  private preactOptions: NonNullable<Config['preactOptions']>;

  constructor(protected config: Config) {
    super(config);

    const preactOptions = config.preactOptions;
    if (!preactOptions) {
      throw TypeError('PreactPlugin requires Config.preactOptions to be set');
    }

    this.preactOptions = preactOptions;
  }

  declareImports(): void { }
}
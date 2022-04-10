import { Config } from '../../Config';
import { Imports } from '../Imports';
import { JSXPlugin } from './JSXPlugin';

export class ReactNativePlugin extends JSXPlugin {
  id = 'react-native';
  rootTag = 'View';

  private reactNativeOptions: NonNullable<Config['reactNativeOptions']>;

  constructor(protected config: Config) {
    super(config);

    const { reactNativeOptions } = config;
    if (!reactNativeOptions) {
      throw TypeError('ReactPlugin requires Config.reactNativeOptions to be set');
    }

    this.reactNativeOptions = reactNativeOptions;
  }

  declareImports(imports: Imports): void {
    if (this.reactNativeOptions.importReact) {
      imports.add({ module: 'react', defaultImport: 'React' });
    }
    imports.add({ module: 'react-native', namedImports: ['View'] });
  }
}
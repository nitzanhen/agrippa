import { Config } from '../../config';
import { declareConst } from '../../utils/codegen';
import { Blocks } from '../Blocks';
import { Imports } from '../Imports';
import { JSXPlugin } from './JSXPlugin';

/** @todo find a better place for these */
export const RN_STYLING_BLOCK_KEY = 'react-native-styling';
export const RN_STYLING_BLOCK_PRECEDENCE = 7;

export class ReactNativePlugin extends JSXPlugin {
  readonly id = 'react-native';
  rootTag = 'View';

  private reactOptions: NonNullable<Config['reactOptions']>;
  private reactNativeOptions: NonNullable<Config['reactNativeOptions']>;

  constructor(protected config: Config) {
    super(config);

    const { reactOptions, reactNativeOptions } = config;
    if (!reactOptions || !reactNativeOptions) {
      throw TypeError('ReactPlugin requires Config.reactOptions and Config.reactNativeOptions to be set');
    }

    this.reactOptions = reactOptions;
    this.reactNativeOptions = reactNativeOptions;
  }

  declareImports(imports: Imports): void {
    if (this.reactOptions.importReact) {
      imports.add({ module: 'react', defaultImport: 'React' });
    }
    imports.add({ module: 'react-native', namedImports: ['View'] });


    if (this.config.styling === 'react-native') {
      imports.add({ module: 'react-native', namedImports: ['StyleSheet'] });
    }
  }

  onCompose(blocks: Blocks, imports: Imports, config: Config): void {
    super.onCompose(blocks, imports, config);

    blocks.add({
      key: RN_STYLING_BLOCK_KEY,
      precedence: RN_STYLING_BLOCK_PRECEDENCE,
      data: declareConst('styles', 'StyleSheet.create({})')
    });
  }
}
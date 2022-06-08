import { Options, Styling } from '../../options';
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

  private reactOptions: NonNullable<Options['reactOptions']>;
  private reactNativeOptions: NonNullable<Options['reactNativeOptions']>;

  constructor(protected options: Options) {
    super(options);

    const { reactOptions, reactNativeOptions } = options;
    if (!reactOptions || !reactNativeOptions) {
      throw TypeError('ReactPlugin requires Options.reactOptions and Options.reactNativeOptions to be set');
    }

    this.reactOptions = reactOptions;
    this.reactNativeOptions = reactNativeOptions;
  }

  declareImports(imports: Imports): void {
    if (this.reactOptions.importReact) {
      imports.add({ module: 'react', defaultImport: 'React' });
    }
    imports.add({ module: 'react-native', namedImports: ['View'] });


    if (this.options.styling === Styling.REACT_NATIVE) {
      imports.add({ module: 'react-native', namedImports: ['StyleSheet'] });
    }
  }

  onCompose(blocks: Blocks, imports: Imports, options: Options): void {
    super.onCompose(blocks, imports, options);

    if (this.options.styling === Styling.REACT_NATIVE) {
      blocks.add({
        key: RN_STYLING_BLOCK_KEY,
        precedence: RN_STYLING_BLOCK_PRECEDENCE,
        data: declareConst('styles', 'StyleSheet.create({})')
      });
    }
  }
}
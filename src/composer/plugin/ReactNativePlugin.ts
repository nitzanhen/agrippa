import { Blocks } from '../Blocks';
import { Imports } from '../Imports';
import { ReactPlugin } from './ReactPlugin';

export class ReactNativePlugin extends ReactPlugin {
  rootTag = 'View';

  onCompose(blocks: Blocks, imports: Imports): void {
    const options = this.config.reactNativeOptions!;
    if (options.importReact) {
      imports.add({ module: 'react', defaultImport: 'React' });
    }
    imports.add({ module: 'react-native', namedImports: ['View'] });

    const declaration = this.getComponentDeclaration();

    blocks.add({
      key: 'declaration',
      precedence: 10, /** @todo replace with some constant, somewhere */
      data: declaration,
    });
  }
}
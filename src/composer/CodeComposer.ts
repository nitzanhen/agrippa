
import { Config } from '../config';
import { Blocks } from './Blocks';
import { Imports } from './Imports';
import { ComposerPlugin } from './plugin';

/**
 * @todo description
 */
export class CodeComposer {

  protected plugins: ComposerPlugin[] = [];
  protected readonly config: Config;

  public constructor(config: Config) {
    this.config = config;
  }

  public addPlugin(plugin: ComposerPlugin) {
    const keyIndex = plugin.id ? this.plugins.findIndex(p => p.id === plugin.id) : -1;
    if (keyIndex === -1) {
      this.plugins.push(plugin);
    }
    else {
      this.plugins.splice(keyIndex, 1, plugin);
    }
  }

  compose() {
    const blocks = new Blocks();
    const imports = new Imports();

    for (const plugin of this.plugins) {
      plugin.onCompose(blocks, imports, this.config);
    }

    blocks.add(imports.getBlock());
    

    return blocks.join();
  }
}
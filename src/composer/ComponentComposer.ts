
import { Config } from '../Config';
import { Blocks } from './Blocks';
import { Imports } from './Imports';
import { ComposerPlugin } from './plugin';

/**
 * @todo description
 */
export class ComponentComposer {

  protected plugins: ComposerPlugin[] = [];
  protected readonly config: Config;

  public constructor(config: Config) {
    this.config = config;
  }

  public registerPlugin(plugin: ComposerPlugin) {
    /** @todo consider an OrderedMap? */
    const keyIndex = this.plugins.findIndex(p => p.key === plugin.key);
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
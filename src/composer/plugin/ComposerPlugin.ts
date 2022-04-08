import { Config } from '../../Config';
import { Blocks } from '../Blocks';
import { Imports } from '../Imports';

/**
 * Interface for a ComponentComposer plugin. 
 */
export interface ComposerPlugin {
  /**
   * optional plugin id; if set, it is used as a unique identifier to the plugin,
   * particularily implying no two plugins with the same id can be used simultaneously.
   */
  id?: string;

  /**
   * compose() hook; called when Composer.compose() is called to form the component code.
   */
  onCompose(blocks: Blocks, imports: Imports, config: Config): void;
}

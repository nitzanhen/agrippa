import { Config } from '../../Config';
import { Blocks } from '../Blocks';
import { Imports } from '../Imports';

export interface ComposerPlugin {
  key: string;
  onCompose: (blocks: Blocks, imports: Imports, config: Config) => void;
}

import { Logger } from '../logger';
import { Options } from '../options/Options';
import { AgrippaDir } from './AgrippaDir';
import { AgrippaFile } from './AgrippaFile';

export interface Context {
  options: Options;
  createdFiles: AgrippaFile[];
  createdDirs: AgrippaDir[];
  variables: Record<string, any>;

  readonly logger: Logger
}
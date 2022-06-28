import { Context } from './Context';

export interface RunOutput extends Pick<Context,
  | 'options'
  | 'plugins'
  | 'stages'
  | 'createdFiles'
  | 'createdDirs'
  | 'variables'
  | 'stackTags'> {
  logs: string;
}
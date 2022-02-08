import { Config } from '../Config';
import { Agrippa } from '../utils';


export interface PipelineContextFile {}

export interface PipelineContext {
  config: Config;

  loadedFiles: Record<string, Agrippa.File | null>

  createdFiles: Agrippa.File[],
  createdDirs: Agrippa.Dir[],

  pcName: string;
  kcName: string;

  dirPath: string;
  dirName: string;

  createStylesFile: boolean;
}
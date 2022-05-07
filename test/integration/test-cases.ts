import { AgrippaDir, AgrippaFile, Config, InputConfig, RunOptions } from '../../src';

export interface IntegrationTestCase {
  description?: string;
  input: {
    config: InputConfig,
    options?: RunOptions
  },
  output: {
    config?: Config
    createdFiles?: AgrippaFile[],
    createdDirs?: AgrippaDir[],
    variables?: Record<string, any>
  }
}

const testCases: IntegrationTestCase[] = [
];

export default testCases;
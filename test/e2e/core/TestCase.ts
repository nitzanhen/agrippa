import { join } from 'path';
import fg from 'fast-glob';
import type { Config } from 'generate/Config';
import { CodeFile, scanCodeFiles } from './CodeFile';
import { fetchTestInfo, TestInfo, TEST_INFO_FILENAME } from './TestInfo';

export interface TestCase {
  name: string;
  command: string;
  dirPath: string;
  config: Partial<Config>;
  result: CodeFile[];
}

export async function createTestCase(dirPath: string): Promise<TestCase> {
  const tinfo: TestInfo = await fetchTestInfo(join(dirPath, TEST_INFO_FILENAME));
  const config: Partial<Config> = require(join(dirPath, '.agripparc.json'));

  const resultsPath = join(dirPath, 'result');

  const resultsFiles = await scanCodeFiles(resultsPath);

  console.log(resultsFiles);

  return {
    name: tinfo.name,
    command: tinfo.command,
    dirPath,
    config,
    result: resultsFiles
  };
}

export async function fetchTestCases(testCasesDir: string): Promise<TestCase[]> {
  const caseDirs = await fg('*', {
    onlyDirectories: true,
    objectMode: true,
    cwd: testCasesDir
  });

  const testDirs = Promise.all(caseDirs
    .filter(({ dirent }) => dirent.isDirectory())
    .map(({ name }) => join(testCasesDir, name))
    .map(path => createTestCase(path))
  );

  return testDirs;
}
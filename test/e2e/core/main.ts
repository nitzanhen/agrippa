import { join, resolve } from 'path';
import fsp from 'fs/promises';
import os from 'os';

import { fetchTestCases } from './TestCase';
import { runTest } from './runTest';
import { getAgrippaRoot } from './getAgrippaRoot';

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});


async function main() {
  const outputDir = await fsp.mkdtemp(join(os.tmpdir(), 'agrippa'));

  const testCasesDir = resolve(await getAgrippaRoot(), 'test', 'e2e', 'cases');

  const testCases = await fetchTestCases(testCasesDir);

  const results = await Promise.allSettled(
    testCases.map(
      testCase => runTest(
        testCase,
        join(outputDir, testCase.name)
      )
    )
  );

  fsp.rm(outputDir, { force: true, recursive: true });
}

main();


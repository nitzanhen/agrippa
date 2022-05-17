// @ts-check

import { run } from '../dist/index.mjs';

async function main() {
  const result = await run({
    name: 'basic-component',
    environment: 'react',
    pure: true,
    reportUsageStatistics: false,
    lookForUpdates: false
  });

  const { createdFiles, createdDirs } = result;
  console.log(createdFiles, createdDirs);
};

main().catch(console.error);
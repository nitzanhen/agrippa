import { createConfig } from '../Config';
import { loadFiles } from '../loadFiles';
import { run } from '../run';
import { defaultStages } from '../stage';


async function main() {

  const envFiles = await loadFiles();

  const config = createConfig({ name: 'NiceComponent' }, envFiles);

  const stages = defaultStages(config);

  await run({
    envFiles,
    config,
    stages
  });
}

main().catch(console.error);



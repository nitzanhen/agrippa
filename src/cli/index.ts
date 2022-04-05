import { keys } from 'rhax';
import { Config } from '../Config';
import { loadFiles } from '../loadFiles';
import { run } from '../run';
import { defaultStages } from '../stage';


async function main() {

  const envFiles = await loadFiles();

  const options = {};

  const stages = defaultStages(options);

  await run({
    envFiles,
    config: { pure: false } as Config,
    name: 'NiceComponent'
  });
}

main().catch(console.error);



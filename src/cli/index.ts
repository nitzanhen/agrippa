import { keys } from 'rhax';
import { Config } from '../Config';
import { loadFiles } from '../loadFiles';
import { run } from '../run';


async function main() {
  console.log('cli running');

  const envFiles = await loadFiles();
  console.log('loaded envfiles', keys(envFiles));

  await run({ envFiles, config: {} as Config });
  console.log('cli: done');
}

main().catch(console.error);



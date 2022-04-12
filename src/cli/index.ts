import { createConfig } from '../config';
import { loadFiles } from '../loadFiles';
import { run } from '../run';
import { defaultStages } from '../stage';


async function main() {

  const envFiles = await loadFiles();

  await run({
    name: 'NiceComponent',
    environment: 'react-native',
    styling: 'react-native',
    overwrite: true
  },
    { envFiles }
  );
}

main().catch(console.error);



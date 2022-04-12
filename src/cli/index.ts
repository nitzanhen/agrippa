import { loadFiles } from '../loadFiles';
import { run } from '../run';


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



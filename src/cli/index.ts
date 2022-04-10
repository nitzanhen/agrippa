import { Config } from '../Config';
import { loadFiles } from '../loadFiles';
import { run } from '../run';
import { defaultStages } from '../stage';
import { kebabCase } from '../utils/strings';


async function main() {

  const envFiles = await loadFiles();

  const config: Config = {
    name: 'NiceComponent',
    get kebabName() {
      return kebabCase(this.name);
    },
    componentOptions: {
      exportType: 'named',
      declaration: 'const'
    },
    environment: 'preact',
    typescript: true,
    styling: 'styled-components',
    styleFileOptions: {
      extension: 'ts',
      module: true
    },
    baseDir: process.cwd(),
    destination: '.',
    allowOutsideBase: false,
    overwrite: true,

    reactOptions: {
      importReact: true
    },
    reactNativeOptions: {
      importReact: true
    },
    solidjsOptions: {},
    preactOptions: {},

    pure: false
  };

  const stages = defaultStages(config);

  await run({
    envFiles,
    config: config,
    stages
  });
}

main().catch(console.error);



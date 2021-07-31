import { Config } from './Config';
import { generateFiles } from './generateFiles';
import { generateReactCode } from './generateReactCode';

export async function run(config: Config) {
  const componentCode = generateReactCode(config);
  try {
    await generateFiles(config, componentCode);

    console.log('Success!')
  }
  catch(e) {
    console.error('Unexpected error', e);
    process.exit(1);
  }
}
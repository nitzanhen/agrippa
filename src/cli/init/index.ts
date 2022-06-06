import { writeFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { Argv, BuilderCallback, CommandModule } from 'yargs';
import { Logger } from '../../logger';
import { loadFile } from '../../utils/files/loadFile';
import { getConfigTemplate } from './getConfigTemplate';

const cliLogger = Logger.consoleLogger();

const builder = (yargs: Argv) => yargs.options({
  migrate: {
    type: 'boolean',
    desc: 'If passed, Agrippa will attempt to migrate from an old (JSON) config',
    default: false
  },
  bare: {
    type: 'boolean',
    desc: 'If passed, Agrippa will generate a config that does not import agrippa. This is used for global installations.',
  }
});

type InitCommand = (typeof builder) extends BuilderCallback<{}, infer R> ? CommandModule<{}, R> : never;

export const initCommand: InitCommand = {
  command: 'init [options]',
  describe: "Initialize Agrippa's configuration for this project",
  builder,
  handler: async argv => {
    const bare = argv.bare
      ?? await loadFile('./package.json').then(
        pkg => !('agrippa' in pkg.devDependencies || 'agrippa' in pkg.dependencies)
      );

    const fileContents = getConfigTemplate(bare!);

    try {
      const path = join(cwd(), 'agrippa.config.mjs');

      await writeFile(path, fileContents, { flag: 'wx' });

      cliLogger.info(`\nGenerated a fresh Agrippa config at ${path}\n`);
    }
    catch (e) {
      if (e.code === 'EEXIST') {
        cliLogger.error('\nAn Agrippa config file `agrippa.config.mjs` already exists.\n');
      }
      else {
        throw e;
      }
    }
  }
};
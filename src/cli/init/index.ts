import { writeFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { Argv, BuilderCallback, CommandModule } from 'yargs';
import { Logger, styles } from '../../logger';
import { loadFileQuery } from '../../files';
import { pkgJson } from '../../utils/pkgJson';
import { getConfigTemplate } from './getConfigTemplate';

const cliLogger = Logger.consoleLogger();

const builder = (yargs: Argv) => yargs.options({
  bare: {
    type: 'boolean',
    desc: 'If passed, Agrippa will generate a config that does not import agrippa. This is used for global installations.',
  },
  typescript: {
    type: 'boolean',
    alias: 'ts',
    desc: 'If true, Agrippa will create a Typescript config instead of an mjs'
  }
});

type InitCommand = (typeof builder) extends BuilderCallback<{}, infer R> ? CommandModule<{}, R> : never;

export const initCommand: InitCommand = {
  command: 'init [options]',
  describe: "Initialize Agrippa's configuration for this project",
  builder,
  handler: async argv => {

    cliLogger.info(
      '',
      `Agrippa v${pkgJson.version}`,
      '',
    );

    const bare = argv.bare
      ?? await loadFileQuery({ search: 'package.json' }).then(
        ([pkg]) => !('agrippa' in pkg.devDependencies || 'agrippa' in pkg.dependencies)
      );

    if (bare) {
      cliLogger.warn(
        `${argv.bare
          ? 'The `--bare` flag was passed'
          : 'Agrippa was not detected as a local dependency'
        }. It's highly recommended to install agrippa as a dev dependency, rather than using it as a global package.`,
        'Generating a "bare" config...',
        ''
      );
    }

    const typescript = argv.typescript!
      ?? await loadFileQuery({ search: 'tsconfig.json' }).then(
        ([, path]) => !!path
      );

    const configName = `agrippa.config.${typescript ? 'ts' : 'mjs'}`;
    const path = join(cwd(), configName);
    cliLogger.info(`Generating a fresh Agrippa config at ${styles.path(path)}...\n`);

    const fileContents = getConfigTemplate(bare!, typescript);

    try {

      await writeFile(path, fileContents, { flag: 'wx' });

      cliLogger.info(styles.success('Successfully generated!\n'));
    }
    catch (e) {
      if (e.code === 'EEXIST') {
        cliLogger.error(`An Agrippa config file \`${configName}\` already exists at the current working directory.\n`);
      }
      else {
        throw e;
      }
    }
  }
};
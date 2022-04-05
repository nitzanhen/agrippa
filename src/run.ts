import { AgrippaFile } from './AgrippaFile';
import { Config } from './Config';
import { Logger, styles } from './logger';
import { createDir } from './pipeline/createDir';
import { Stage, summaryLine } from './pipeline/Stage';
import { indent } from './utils/strings';

export interface RunOptions {
  envFiles: Record<string, any>;
  config: Config;
  stages?: Stage[]
}

export function defaultStages(options: RunOptions): Stage[] {
  return [
    ...createDir({
      path: './temp',
      files: [
        new AgrippaFile('./index.ts', 'a'),
        new AgrippaFile('./styles.css', 'b'),
        new AgrippaFile('./Component.tsx', 'c'),
      ]
    })
  ];
}


/**
 * Main Agrippa process.
 * Generates directories, files and file contents based on the given params.
 */
export async function run(options: RunOptions) {
  const { config, stages = defaultStages(options) } = options;

  let context = { config };
  const logger = console;

  for (const stage of stages) {
    const stageLogger = new Logger();

    const result = await stage(context, stageLogger);
    logger.log(summaryLine(result));
    const logs = stageLogger.consume();
    logger.log(indent(styles.comment(logs), 2, ' '));

    context = result.newContext ?? context;
  }

  logger.log('run: done');
}
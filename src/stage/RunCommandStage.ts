import { exec as execCB } from 'child_process';
import { promisify } from 'util';
import { reduce } from 'rhax';
import { Logger } from '../logger';
import { Context } from '../context';
import { Stage } from './Stage';
import { StageResult, StageStatus } from './StageResult';

const exec = promisify(execCB);

export interface RunCommandOptions {
  rawCommand: string;
  runOnFail?: boolean
}

export class RunCommandStage extends Stage {

  protected rawCommand: string;
  protected runOnFail: boolean;

  constructor({
    rawCommand,
    runOnFail = false
  }: RunCommandOptions) {
    super();

    this.rawCommand = rawCommand;
    this.runOnFail = runOnFail;
  }

  async execute(context: Context, logger: Logger): Promise<StageResult> {
    logger.debug(
      'runCommand: initiated',
      `Raw command (before substituting variables): ${this.rawCommand}`,
      `context.hasFailedStages is ${context.hasFailedStages} and runOnFail is ${this.runOnFail}`
    );

    if (context.hasFailedStages && !this.runOnFail) {
      logger.debug('Skipping...');

      logger.info('Post command is skipped because an earlier stage failed.');
      
      return new StageResult(
        StageStatus.NA,
        'Post command skipped'
      );
    }

    // Create command 
    const { variables } = context;
    logger.debug('Context variables:', variables);
    const command = reduce.object(
      variables,
      (cmd, value, key) => cmd.replace(`<${key}>`, value),
      this.rawCommand
    );

    logger.debug(`Command (after substituting variables): ${command}`);

    // Execute the command
    try {
      const { stdout, stderr } = await exec(command);
      if (stderr) {
        throw new Error(stderr);
      }

      logger.info(stdout ? `output: ${stdout}` : 'No output received from command.');

      return new StageResult(
        StageStatus.SUCCESS,
        'Post command successfully executed'
      );
    }
    catch (e) {
      logger.error(e);

      return new StageResult(
        StageStatus.ERROR,
        'Post command failed'
      );
    }
  }
}
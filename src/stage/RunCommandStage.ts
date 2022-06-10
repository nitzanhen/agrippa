import { exec as execCB } from 'child_process';
import { promisify } from 'util';
import { reduce } from 'rhax';
import { Logger } from '../logger';
import { Stage } from './Stage';
import { Context } from './Context';
import { StageResult, StageStatus } from './StageResult';

const exec = promisify(execCB);

export interface RunCommandOption {
  rawCommand: string;
}

export class RunCommandStage extends Stage {

  protected rawCommand: string;

  constructor({
    rawCommand
  }: RunCommandOption) {
    super();

    this.rawCommand = rawCommand;
  }

  async execute(context: Context, logger: Logger): Promise<StageResult> {
    logger.debug('runCommand: initiated');
    logger.debug(`Raw command (before substituting variables): ${this.rawCommand}`);

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
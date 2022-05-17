import { exec as execCB } from 'child_process';
import { promisify } from 'util';
import { reduce } from 'rhax';
import { Stage, stageResult, StageStatus } from './Stage';

const exec = promisify(execCB);


export const runCommand = (rawCommand: string): Stage => {
  return async function runCommand(context, logger) {
    logger.debug('runCommand: initiated');
    logger.debug(`Raw command (before substituting variables): ${rawCommand}`);

    // Create command 
    const { variables } = context;
    logger.debug('Context variables:', variables);
    const command = reduce.object(
      variables,
      (cmd, value, key) => cmd.replace(`<${key}>`, value),
      rawCommand
    );

    logger.debug(`Command (after substituting variables): ${command}`);

    // Execute the command
    try {
      const { stdout, stderr } = await exec(command);
      if (stderr) {
        throw new Error(stderr);
      }

      logger.info(stdout ? `output: ${stdout}` : 'No output received from command.');

      return stageResult(
        StageStatus.SUCCESS,
        'Post command successfully executed'
      );
    }
    catch (e) {
      logger.error(e);

      return stageResult(
        StageStatus.ERROR,
        'Post command failed'
      );
    }
  };
};
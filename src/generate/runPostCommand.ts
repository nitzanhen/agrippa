import { exec as execCB } from 'child_process';
import { promisify } from 'util';
import { gray } from 'chalk';
import { Logger } from '../logger';
import { substituteVars, PostCommandVariables } from '../utils/substitutePaths';
import { Config } from './Config';

const exec = promisify(execCB);

export async function runPostCommand(postCommandVars: PostCommandVariables, config: Config, logger: Logger) {
  const { postCommand: rawPostCommand } = config;

  if (rawPostCommand) {
    const postCommand = substituteVars(rawPostCommand, postCommandVars);

    const { stdout, stderr } = await exec(postCommand);

    if (stderr) {
      logger.stage(
        'error',
        'Post command failed',
        `Raw post command (before filling in actual paths): ${gray(rawPostCommand)}`,
        gray(`command: ${postCommand}`),
        stderr
      );
    }
    else {
      logger.stage(
        'success',
        'Post command successfully executed',
        gray(`Raw post command (before substituting vars): ${rawPostCommand}`),
        gray(`command: ${postCommand}`),
        gray(stdout ? `output: ${stdout}` : 'No output received from command.')
      );
    }

  }
  else {
    logger.stage(
      'NA',
      'No Post command to run'
    );
  }
}
import { RunCommandOptions, RunCommandStage } from '../stage/RunCommandStage';
import { Plugin } from './Plugin';

export type PostCommandOptions = Omit<RunCommandOptions, 'rawCommand'>;

/**
 * A plugin that adds a post-command stage, i.e. a stage that runs any command.
 */
export class PostCommandPlugin extends Plugin {
  constructor(
    protected readonly command: string,
    protected readonly options: PostCommandOptions = { runOnFail: false }
  ) {
    super();
  }

  onCreateStages() {
    this.context.addStage(
      new RunCommandStage({ 
        rawCommand: this.command, 
        ...this.options 
      })
    );
  }
}
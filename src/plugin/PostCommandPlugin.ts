import { RunCommandStage } from '../stage/RunCommandStage';
import { Plugin } from './Plugin';

/**
 * A plugin that adds a post-command stage, i.e. a stage that runs any command.
 */
export class PostCommandPlugin extends Plugin {
  constructor(
    protected readonly command: string
  ) {
    super();
  }

  onCreateStages() {
    this.context.addStage(
      new RunCommandStage({ rawCommand: this.command })
    );
  }
}
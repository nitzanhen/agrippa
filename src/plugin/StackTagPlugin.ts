import { Plugin } from './Plugin';

/**
 * A plugin that defines one or more stack tags.
 */
export class StackTagPlugin extends Plugin {
  constructor(
    public tags: string[]
  ) {
    super();
  }

  onCreateStackTags() {
    for (const tag of this.tags) {
      this.context.addStackTag(tag);
    }
  }
}
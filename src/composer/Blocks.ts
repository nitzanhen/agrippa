import { tuple } from 'rhax';
import { SemiPartial } from '../utils';

export interface Block {
  key: string;
  data: string;
  separator: string;
  precedence: number;
}

type BlockInput = SemiPartial<Block, 'separator'>;


export class Blocks {
  protected readonly blocks: Map<string, Block>;

  constructor(protected readonly initialBlocks: Block[] = []) {
    const keyBlockPairs = initialBlocks.map(b => tuple(b.key, b));
    this.blocks = new Map(keyBlockPairs);
  }

  get(key: string) {
    return this.blocks.get(key);
  }

  add({ key, precedence, data, separator = '\n\n' }: BlockInput) {
    this.blocks.set(key, { key, precedence, data, separator });
  }

  delete(key: string) {
    return this.blocks.delete(key);
  }

  join() {
    if (this.blocks.size === 0) {
      return '';
    }

    const blocksSorted = [...this.blocks.values()].sort((b1, b2) => b1.precedence - b2.precedence);
    const head = blocksSorted.slice(0, -1);
    const last = blocksSorted[blocksSorted.length - 1];

    return [
      ...head.map(({ data, separator }) => data + separator),
      last.data
    ].join('');
  }
}
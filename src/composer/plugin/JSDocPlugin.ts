import { Config } from '../../config';
import { Blocks } from '../Blocks';
import { Imports } from '../Imports';
import { Comment } from '../Comment';
import { cstr } from '../../utils';
import { ComposerPlugin } from './ComposerPlugin';
import { DECLARATION_BLOCK_PRECEDENCE } from './JSXPlugin';

/** @todo find a better place for these */
export const TS_CHECK_BLOCK_KEY = 'ts-check';
export const TS_CHECK_BLOCK_PRECEDENCE = -1;

export const DECLARATION_JSDOC_BLOCK_KEY = 'declaration-jsdoc';
export const DECLARATION_JSDOC_BLOCK_PRECEDENCE = DECLARATION_BLOCK_PRECEDENCE - 1;

export const PROPS_JSDOC_BLOCK_KEY = 'props-jsdoc';
export const PROPS_JSDOC_BLOCK_PRECEDENCE = 5;

export interface JSDocPluginOptions {
  generateTypes?: boolean;
  includeTsCheck?: boolean;
  getCommentContent?: (config: Config) => string;
}

/**
 * A composer plugin for adding a JSDoc comment to the generated component,
 * or using JSDoc types (typically for type checking in JS files).
 */
export class JSDocPlugin implements ComposerPlugin {
  id = 'jsdoc';

  protected readonly config: Config;
  protected readonly generateTypes: boolean;
  protected readonly includeTsCheck: boolean;
  protected readonly getCommentContent?: (config: Config) => string;

  /**
   * @param generateTypes Whether to generate 
   * @param includeTsCheck Whether to include a ts-check statement at the top of the file. 
   * By default, has the same value as `generateTypes`.
   */
  constructor(
    config: Config, {
      getCommentContent,
      generateTypes = false,
      includeTsCheck = generateTypes,
    }: JSDocPluginOptions = {}) {
    this.config = config;
    this.getCommentContent = getCommentContent;
    this.generateTypes = generateTypes;
    this.includeTsCheck = includeTsCheck;
  }

  get propInterfaceName() {
    return this.config.name + 'Props';
  }


  onCompose(blocks: Blocks, _: Imports): void {
    if (this.includeTsCheck) {
      blocks.add({
        key: TS_CHECK_BLOCK_KEY,
        precedence: TS_CHECK_BLOCK_PRECEDENCE,
        data: Comment.stringify({ type: 'single', content: '@ts-check' }),
        separator: '\n'
      });
    }

    if (this.generateTypes) {
      blocks.add({
        key: PROPS_JSDOC_BLOCK_KEY,
        precedence: PROPS_JSDOC_BLOCK_PRECEDENCE,
        data: Comment.stringify({ type: 'jsdoc', content: `@typedef {Object} ${this.propInterfaceName}` })
      });
    }

    const commentContent = this.getCommentContent?.(this.config) ?? '';
    const commentString = commentContent + cstr(this.generateTypes, `\n@param {${this.propInterfaceName}} props`);

    blocks.add({
      key: DECLARATION_JSDOC_BLOCK_KEY,
      precedence: DECLARATION_JSDOC_BLOCK_PRECEDENCE,
      data: Comment.stringify({ type: 'jsdoc', content: commentString }),
      separator: '\n'
    });
  }
}
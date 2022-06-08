import { Options } from '../../options';
import { createAssignment } from '../../utils/codegen';
import { Blocks } from '../Blocks';
import { Imports } from '../Imports';
import { ComposerPlugin } from './ComposerPlugin';

/** @todo find a better place for these */
const PROP_TYPES_BLOCK_KEY = 'prop-types';
const PROP_TYPES_BLOCK_PRECEDENCE = 15;

export class PropTypesPlugin implements ComposerPlugin {
  id = 'prop-types';

  protected getPropTypesDeclaration(name: string) {
    return createAssignment(name, 'propTypes', '{}');
  }

  onCompose(blocks: Blocks, imports: Imports, options: Options): void {
    const { name } = options;

    imports.add({
      module: 'prop-types',
      defaultImport: 'PropTypes'
    });

    blocks.add({
      key: PROP_TYPES_BLOCK_KEY,
      precedence: PROP_TYPES_BLOCK_PRECEDENCE,
      data: this.getPropTypesDeclaration(name)
    });
  }
}
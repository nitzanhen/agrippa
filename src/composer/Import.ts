import { cstr } from '../utils';

export interface Import {
  module: string;
  namedImports?: string[];
  defaultImport?: string;
}

export namespace Import {
  /** 
   * Forms the actual import code command from an Import object that represents it.
   * 
   * @example
   * const i1 = Import.stringify({ module: 'react', defaultImport: 'React' });
   * console.log(i1); // "import React from 'react';"
   * 
   * const i2 = Import.stringify({ module: 'react', namedImports: ['useState'] });
   * console.log(i2); // "import { useState } from 'react';"
   * 
   * const i3 = Import.stringify({ module: 'react', defaultImport: 'React', namedImports: ['useState'] });
   * console.log(i3); // "import React, { useState } from 'react';"
   * 
   * const i4 = Import.stringify({ module: './styles.css' });
   * console.log(i4); // "import './styles.css';"
   */
  export function stringify(i: Import) {
    const { module, namedImports, defaultImport } = i;

    const namedString = namedImports?.length ? `{ ${namedImports?.join(', ')}} ` : null;

    return `import ${defaultImport ?? ''}${cstr(!!defaultImport && !!namedString, ', ')}${namedString ?? ''} from '${module}';`;
  }


  /** 
   * Merges two `Import`s. Merging imports only makes sense for imports of the same module; 
   * if they are different, an error is thrown. Also, if both `Import`s contain default imports but they differ,
   * an error is thrown, as this seems to make no sense logically.
   */
  export function merge(i1: Import, i2: Import): Import {

    if (i1.module !== i2.module) {
      throw new RangeError('Illogical merge: both imports must refer to the same module');
    }

    const module = i1.module; // === i2.module

    const default1 = i1.defaultImport;
    const default2 = i2.defaultImport;
    const named1 = i1.namedImports ?? [];
    const named2 = i2.namedImports ?? [];

    if (default1 && default2 && default1 !== default2) {
      throw new RangeError('Illogical merge: cannot merge two different default imports.');
    }

    // Extract the default import from any of the two (might be null).
    const defaultImport = default1 ?? default2;

    // Concat the named imports
    const namedImports = [...named1, ...named2];

    return {
      module,
      defaultImport,
      namedImports: namedImports.length > 0 ? namedImports : undefined
    };
  }
}
export interface DefaultImport {
  importType: 'default';
  module: string;
  importAs: string;
}

export interface NamedImport {
  importType: 'named';
  module: string;
  whatToImport: string[];
}

export interface CompositeImport {
  importType: 'composite';
  module: string;
  defaultImport: string;
  namedImports: string[];
}

export interface SideEffectImport {
  importType: 'side-effect';
  module: string;
}

export type Import = DefaultImport | NamedImport | CompositeImport | SideEffectImport;

export namespace Import {
  /** 
   * Forms the actual import code command from an Import object that represents it.
   * 
   * @example
   * const i1 = Import.stringify({ importType: 'default', module: 'react', importAs: 'React' });
   * console.log(i1); // "import React from 'react';"
   * 
   * const i2 = Import.stringify({ importType: 'named', module: 'react', whatToImport: ['useState'] });
   * console.log(i2); // "import { useState } from 'react';"
   * 
   * const i3 = Import.stringify({ importType: 'composite', module: 'react', defaultImport: 'React', namedImports: ['useState'] });
   * console.log(i3); // "import React, { useState } from 'react';"
   * 
   * const i4 = Import.stringify({ importType: 'side-effect', module: './styles.css' });
   * console.log(i4); // "import './styles.css';"
   */
  export function stringify(i: Import) {
    switch (i.importType) {
      case 'default':
        return `import ${i.importAs} from '${i.module}';`;
      case 'named':
        return `import { ${i.whatToImport.join(', ')} } from '${i.module}';`;
      case 'composite':
        return `import ${i.defaultImport}, { ${i.namedImports.join(', ')} } from '${i.module}';`;
      case 'side-effect':
        return `import '${i.module}';`;
    }
  }
}
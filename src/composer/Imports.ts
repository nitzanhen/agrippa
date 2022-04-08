import { Block } from './Blocks';

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

export const stringifyImport = (i: Import) => {
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
};

export class Imports {
  public static readonly BLOCK_KEY = 'imports';
  public static readonly BLOCK_PRECEDENCE = -Number.EPSILON;

  protected imports: Map<string, Import> = new Map();

  public constructor() { };

  public add(imp: Import) {
    this.imports.set(imp.module, imp);
  }

  getBlock(): Block {
    const data = [...this.imports.values()].map(stringifyImport).join('\n') + '\n';

    return {
      key: Imports.BLOCK_KEY,
      precedence: Imports.BLOCK_PRECEDENCE,
      data,
      separator: '\n'
    };
  }
}
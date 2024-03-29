import { Block } from './Blocks';
import { Import } from './Import';

export class Imports {
  public static readonly BLOCK_KEY = 'imports';
  public static readonly BLOCK_PRECEDENCE = -Number.EPSILON;

  protected imports: Map<string, Import> = new Map();

  public constructor() { };

  public get(module: Import['module']) {
    return this.imports.get(module);
  }

  public delete(module: Import['module']) {
    return this.imports.delete(module);
  }

  public add(newImport: Import) {
    const module = newImport.module;
    const oldImport = this.imports.get(module);
    const i = oldImport ? Import.merge(oldImport, newImport) : newImport;

    this.imports.set(module, i);
  }

  public get size() {
    return this.imports.size;
  }

  getBlock(): Block {
    const data = [...this.imports.values()].map(Import.stringify).join('\n') + '\n';

    return {
      key: Imports.BLOCK_KEY,
      precedence: Imports.BLOCK_PRECEDENCE,
      data,
      separator: '\n'
    };
  }
}
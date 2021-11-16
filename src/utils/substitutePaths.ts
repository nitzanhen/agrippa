import { reduce } from 'rhax';

/** 
 * Paths to fill in for "path variables" (i.e. aliases for well-known dynamic segments of a generated path,
 * Such as <componentPath> for the path at which a component is generated).
 * A record of type VariablePaths is expected to match the corresponding path against each variable.
 */
export interface VariablePaths {
  /** The path at which a component's JS/TS file is created. */
  '<componentPath>': string;
  /** The path at which a component's styles file is created. */
  '<stylesPath>'?: string;
  /** 
   * The directory in which the files are created; 
   * note that if the `--flat` flag is passed, the directory may contain additional files.
   */
  '<dirPath>': string;
  /**
   * An index file for the created directory.
   * Note that this will either contain only an export for the created component (if `--separate-index` is `true`),
   * or the component code itself.
   */
  '<indexPath>'?: string;
}

/**
 * Substituted the variable path aliases in `str` with their values in `variablePaths`.
 * 
 * @param str the str to substitute paths in.
 * @param variablePaths the paths to substitute for each alias.
 */
export const substitutePaths = (str: string, variablePaths: VariablePaths): string =>
  /** @todo fix Rhax such that any casting is not needed. */
  reduce<any, any>(
    (acc, path, alias) => path ? acc.replace(new RegExp(alias as string, 'g'), path) : acc,
    str,
    variablePaths
  );
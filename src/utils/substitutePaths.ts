import { reduce } from './objects';

/** 
 * Variables to fill in for the post-command (e.g. <componentPath> for the path at which a component is generated).
 * A record of type PostCommandVariables is expected to match the corresponding value against each variable.
 */
export interface PostCommandVariables {
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
  /**
   * The generated component's name, in pascal case.
   */
  '<ComponentName>': string;
  /**
   * The generated component's name, in kebab case.
   */
  '<component-name>': string;
}

/**
 * Substituted the variables in `str` with their values in `vars`.
 * 
 * @param str the str to substitute paths in.
 * @param vars the paths to substitute for each alias.
 */
export const substituteVars = (str: string, vars: PostCommandVariables): string =>
  reduce(
    vars,
    (acc, path, alias) => path ? acc.replace(new RegExp(alias as string, 'g'), path) : acc,
    str,
  );
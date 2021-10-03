import { cstr, indent } from './strings';

/**
 * Contains helpers for code generation.
 * This is mostly used by ComponentComposer.
 * @see https://github.com/NitzanHen/agrippa/issues/9
 */


/**
 * Create an import string.
 * @param module where to import from 
 * @param whatToImport the name of the module object to be imported
 * @param importType whether to create a named or default import
 * 
 * @example
 * createImport('react', 'React', 'default') => import React from 'react';
 * createImport('./styles.css') => import './styles.css';
 */
export function createImport(module: string): string;
export function createImport(module: string, whatToImport: string, importType: 'named' | 'default'): string;
export function createImport(module: string, whatToImport?: string, importType?: 'named' | 'default'): string {
  if (!whatToImport) {
    return `import '${module}';`;
  }
  else if (importType === 'named') {
    return `import { ${whatToImport} } from '${module}';`;
  }

  return `import ${whatToImport} from '${module}';`;
}

/**
 * Create a const declaration string
 * 
 * @param name the name to give the const
 * @param value the value to assign to the const
 * @param exported whether the const should be exported
 * @param type optional Typescript type for the const
 * 
 * @example
 * declateConst('classes', 'useStyles()', false) => const classes = useStyles();
 */
export const declareConst = (name: string, value: string, exported: boolean = false, type: string = '') =>
  `${cstr(exported, 'export ')}const ${name}${type} = ${value};`;

/**
 * Create an interface declaration string.
 * This can easily be modified to add the ability to extend from another interface
 * or specify interface props.
 * 
 * @param name the name to give the interface
 * @param exported whether the interface should be exported
 * 
 * @example
 * declareInterface('ButtonProps', true) => export interface ButtonProps {}
 */
export const declareInterface = (name: string, exported: boolean = false) =>
  `${cstr(exported, 'export ')}interface ${name} {}`;

/**
 * Create an arrow function string
 * 
 * @param params *a string* representing the function's parameters 
 * @param body the function's body (as a string)
 */
export const createArrowFunction = (params: string = '', body: string = '') => {
  return `(${params}) => {\n${indent(body)}\n}`;
};

/**
 * Create a default export string
 * @param name the name of the value to be exported
 */
export const createDefaultExport = (name: string) => `export default ${name};`;

/** 
 * Create a comment string. 
 * @param type which comment to create.
 * @param content should be a single line of text. 
 * 
 * @example
 * createComment('single', 'hello!!!') => // 'hello!!!'
 */
export const createComment = (type: 'single' | 'multi' | 'jsdoc', content: string) => ({
  single: (content: string) => `// ${content}`,
  multi: (content: string) => ['/*', ' * ' + content, ' */'].join('\n'),
  jsdoc: (content: string) => ['/**', ' * ' + content, ' */'].join('\n'),
})[type](content);

/**
 * Creates an assignment string.
 * The key is taken to be a simple key, such that dot notation is uses.
 * 
 * @param target the object to assign to
 * @param key the key of the field to assign the value to
 * @param value the value to assign
 * 
 * @example
 * createAssignment('Button', 'propTypes', '{}') => Button.propTypes = {};
 */
export const createAssignment = (target: string, key: string, value: string) =>
  `${target}.${key} = ${value};`;
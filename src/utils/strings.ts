import { formatWithOptions } from 'util';

/** Simple util to render a string conditionally, or *null* if it is not met */
export const ostr = (condition: boolean, string: string) => {
  return condition ? string : null;
};

/** Simple util to render a string conditionally, or *an empty string* if it is not met */
export const cstr = (condition: boolean, string: string) => {
  return condition ? string : '';
};

/** Indents every line of the given string by `num` tabs.  */
export const indent = (str: string, num: number = 1, token = '\t') => {
  return str
    .split('\n')
    .map(line => token.repeat(num) + line)
    .join('\n');
};

/** Joins `lines` with \n, filtering any non-string value. Technically also supports code blocks that are more than one line.  */
export const joinLines = (...lines: (string | false)[]): string => lines.filter(line => typeof line === 'string').join('\n');

export const isLowerCase = (str: string) => str === str.toLocaleLowerCase();

/**
 * Turns the first letter of the string to upper case (and leaves the rest unchanged).
 */
export const capitalize = (str: string) => str && (str[0].toLocaleUpperCase() + str.slice(1));

export const isKebabCase = (str: string) => str.split('-').every(isLowerCase);

export const isCamelCase = (str: string) => !str || /^[a-z][A-Za-z]*$/.test(str);

export const isPascalCase = (str: string) =>  !str || /^[A-Z][A-Za-z]*$/.test(str);

export const pascalCase = (str: string) => {
  if (isPascalCase(str)) {
    return str;
  }
  else if (isCamelCase(str)) {
    return capitalize(str);
  }
  else if (isKebabCase(str)) {
    return str.split('-')
      .map(capitalize)
      .join('');
  }

  throw RangeError('Improper string formatting');
};

export const kebabCase = (str: string) => {
  if (isPascalCase(str) || isCamelCase(str)) {
    return str.split(/(?=[A-Z])/)
      .map(segment => segment.toLocaleLowerCase())
      .join('-');
  }
  else if (isKebabCase(str)) {
    return str;
  }

  throw RangeError('Improper string formatting');
};

/**
 * Format a string for printing.
 * This does little more than Node's default printing behaviour,
 * but allows embedding objects into string without them turning into `[Object object]`.
 */
export const format = (...args: unknown[]) => formatWithOptions({ colors: true }, ...args);

/** Returns an empty string. Exists for clarity. */
export const emptyLine = () => '';

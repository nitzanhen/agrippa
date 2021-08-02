
/** Simple util to render a string conditionally */
export const cstr = (condition: boolean, string: string) => {
  return condition ? string : null
}

export const line = (index: number, str: string | null) => {
  return str && '\t'.repeat(index) + str;
}

export const isLowerCase = (str: string) => str === str.toLocaleLowerCase();

/**
 * Turns the first letter of the string to upper case (and leaves the rest unchanged).
 */
export const capitalize = (str: string) => str[0].toLocaleUpperCase() + str.slice(1)

export const isKebabCase = (str: string) => str.split('-').every(isLowerCase)

const camelCaseRegex = /^[a-z][A-Za-z]+$/;
export const isCamelCase = (str: string) => camelCaseRegex.test(str);

const pascalCaseRegex = /^[A-Z][A-Za-z]+$/;
export const isPascalCase = (str: string) => pascalCaseRegex.test(str);

export const pascalCase = (str: string) => {
  if(isPascalCase(str)) {
    return str;
  }
  else if(isCamelCase(str)) {
    return capitalize(str);
  }
  else if(isKebabCase(str)) {
    return str.split('-')
      .map(capitalize)
      .join('');
  }

  throw RangeError('Improper string formatting')
}
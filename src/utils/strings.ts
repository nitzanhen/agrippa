
/** Simple util to render a string conditionally, or null if it is not met */
export const ostr = (condition: boolean, string: string) => {
  return condition ? string : null
}

/** Simple util to render a string conditionally, or an empty string if it is not met */
export const cstr = (condition: boolean, string: string) => {
  return condition ? string : ''
}

export const line = (index: number, str: string | null) => {
  return str && '\t'.repeat(index) + str;
}

export const isLowerCase = (str: string) => str === str.toLocaleLowerCase();

/**
 * Turns the first letter of the string to upper case (and leaves the rest unchanged).
 */
export const capitalize = (str: string) => str[0].toLocaleUpperCase() + str.slice(1)

export const isKebabCase = (str: string) => str.split('-').every(isLowerCase);

export const isCamelCase = (str: string) => /^[a-z][A-Za-z]*$/.test(str);

export const isPascalCase = (str: string) => /^[A-Z][A-Za-z]*$/.test(str);

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

  throw RangeError('Improper string formatting')
}

export const kebabCase = (str: string) => {
  if (isPascalCase(str) || isCamelCase(str)) {
    return str.split(/(?=[A-Z])/)
      .map(segment => segment.toLocaleLowerCase())
      .join('-');
  }
  else if (isKebabCase(str)) {
    return str;
  }

  throw RangeError('Improper string formatting')

}
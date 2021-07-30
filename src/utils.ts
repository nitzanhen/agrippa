
/** Simple util to render a string conditionally */
export const cstr = (condition: boolean, string: string) => {
  return condition ? string : ''
}
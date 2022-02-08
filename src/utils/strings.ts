
/** Indents every line of the given string by `token`, `num` times.  */
export const indent = (str: string, num: number = 1, token = '\t') => {
  return str
    .split('\n')
    .map(line => token.repeat(num) + line)
    .join('\n');
};
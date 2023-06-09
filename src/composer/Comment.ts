import { pipe } from 'pips';

/**
 * An object representing a code comment. 
 * 
 * @param type which comment the object represents. Options are:
 * - 'single': single line comment.
 * - 'block': block comment.
 * - 'jsdoc': JSDoc comment (starting with "/**").
 * 
 * @param content comment contents. Does not have to be a single line, even if
 * the comment type is 'single' (in this case, the comment represented is comprised of
 * multiple single-line comments).
 */
export interface Comment {
  type: 'single' | 'block' | 'jsdoc';
  content: string;
}

export namespace Comment {
  /**
   * Forms the actual comment code from a Comment object that represents it.
   * 
   * @todo add examples
   */
  export function stringify(c: Comment) {
    switch (c.type) {
      case 'single': return c.content
        .split('\n')
        .map(ln => `// ${ln}`)
        .join('');
      case 'block': return pipe(c.content)
        (data => data.split('\n').map(ln => ' * ' + ln).join('\n'))
        (body => `/*\n${body}\n */`)
        ();
      case 'jsdoc': return pipe(c.content)
      (data => data.split('\n').map(ln => ' * ' + ln).join('\n'))
      (body => `/**\n${body}\n */`)
      ();
    }
  }
}
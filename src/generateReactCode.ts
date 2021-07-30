import { Config } from './Config';
import { cstr } from './utils';

/**
 * Generates the contents of a React component.
 */
export function generateReactCode({ importReact, name, typescript, children, styling, stylingModule }: Config): string {
  return `
    ${importReact && "import React from 'react'"}
    ${cstr(styling === 'css' || styling === 'scss', `import './${name}${cstr(stylingModule,'.module')}.${styling}'`)}

    export const ${name}${cstr(typescript, `: React.${cstr(!children, 'V')}FC`)} = ({ ${cstr(children, 'children')} }) => {

      ${cstr(styling === 'jss' || styling === 'mui', 'const classes = useStyles()')}

      return (
        ${children ? '<div>{children}</div>' : '<div />0'} 
      )
    };
  `
}
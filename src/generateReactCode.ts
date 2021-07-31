import { Config } from './Config';
import { cstr } from './utils';

/**
 * Generates the contents of a React component.
 */
export function generateReactCode({ importReact, name, typescript, children, styling, stylingModule }: Config): string {
  const imports = [
    cstr(importReact, "import React from 'react';"),
    cstr(styling === 'css' || styling === 'scss', `import './${name}${cstr(stylingModule,'.module')}.${styling}'`),
    cstr(styling === 'jss', "import { createUseStyles } from 'react-jss';"),
    cstr(styling === 'mui', "import { makeStyles } from '@material-ui/core';")
  ].join('\n')

  const interfaceName = `${name}Props`
  const typeClass = children ? 'FC' : 'VFC';
  const componentType = cstr(typescript, `React.${typeClass}<${interfaceName}>`)

  return `
    ${imports}

    ${cstr(styling === 'jss', `const useStyles = createUseStyles({});`)}
    ${cstr(styling === 'mui', `const useStyles = makeStyles((theme${cstr(typescript, ': Theme')}) => {});`)}

    ${cstr(typescript, `export interface ${name}Props {}`)}

    export const ${name}${cstr(!!componentType, ': ')}${componentType} = ({ ${cstr(children, 'children')} }) => {

      ${cstr(styling === 'jss' || styling === 'mui', 'const classes = useStyles()')}

      return (
        ${children ? '<div>{children}</div>' : '<div />'} 
      )
    };
  `
}
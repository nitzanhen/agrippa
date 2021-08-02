import { Config } from './Config';
import { cstr, line, pascalCase } from './utils';

/**
 * Generates the contents of a React component.
 */
export function generateReactCode({ importReact, name, typescript, children, styling, stylingModule }: Config): string {
  const pcName = pascalCase(name);

  const interfaceName = `${pcName}Props`
  const typeClass = children ? 'FC' : 'VFC';
  const componentType = cstr(typescript, `React.${typeClass}<${interfaceName}>`)

  return [
    line(0, cstr(importReact, "import React from 'react';")),
    line(0, cstr(styling === 'css' || styling === 'scss', `import './${name}${cstr(stylingModule, '.module')}.${styling}'`)),
    line(0, cstr(styling === 'jss', "import { createUseStyles } from 'react-jss';")),
    line(0, cstr(styling === 'mui', "import { makeStyles } from '@material-ui/core';")),
    '',
    line(0, cstr(styling === 'jss', 'const useStyles = createUseStyles({});')),
    line(0, cstr(styling === 'mui', `const useStyles = makeStyles((theme${cstr(typescript, ': Theme')}) => {});`)),
    line(0, cstr(styling === 'jss' || styling === 'mui', '')),
    line(0, cstr(typescript, `export interface ${pcName}Props {};`)),
    '',
    line(0, `export const ${pcName}${cstr(!!componentType, ': ')}${componentType} = ({ ${children ? 'children' : ''} }) => {`),
    '',
    line(1, cstr(styling === 'jss' || styling === 'mui', 'const classes = useStyles();')),
    line(1, cstr(styling === 'jss' || styling === 'mui', '')),

    line(1, 'return ('),
    line(2, `${children ? '<div>{children}</div>' : '<div />'}`),
    line(1, ');'),
    line(0, '}'),
  ].filter(line => typeof line === 'string').join('\n');
}
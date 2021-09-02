import { ostr, line, pascalCase, cstr, kebabCase } from '../utils/strings';

import { Config } from './Config';

/**
 * Generates the contents of a React component.
 */
export function generateReactCode({ props, importReact, name, typescript, children, styling, stylingModule }: Config): string {
  const pcName = pascalCase(name);
  const kcName = kebabCase(name);

  const interfaceName = `${pcName}Props`
  const typeClass = children ? 'FC' : 'VFC';
  const TSProps = typescript && props === 'ts'

  const componentType = `React.${typeClass}<${interfaceName}>`

  const createStylesFile = (styling === 'css' || styling === 'scss');

  return [
    line(0, ostr(props === 'jsdoc', '//@ts-check')),
    line(0, ostr(importReact, "import React from 'react';")),
    line(0, ostr(createStylesFile && stylingModule, `import classes from './${kcName}.module.${styling}';`)),
    line(0, ostr(createStylesFile && !stylingModule, `import './${kcName}.${styling}';`)),
    line(0, ostr(styling === 'jss', "import { createUseStyles } from 'react-jss';")),
    line(0, ostr(styling === 'mui', "import { makeStyles } from '@material-ui/core';")),
    line(0, ostr(props === 'prop-types', "import PropTypes from 'prop-types';")),
    '',
    line(0, ostr(styling === 'jss', 'const useStyles = createUseStyles({});')),
    line(0, ostr(styling === 'mui', `const useStyles = makeStyles((theme${cstr(typescript, ': Theme')}) => {});`)),
    line(0, ostr(styling === 'jss' || styling === 'mui', '')),

    line(0, ostr(TSProps, `export interface ${pcName}Props {}`)),
    line(0, ostr(TSProps, '')),

    line(0, ostr(props === 'jsdoc', '/**')),
    line(0, ostr(props === 'jsdoc', ` * @typedef ${interfaceName}`)),
    line(0, ostr(props === 'jsdoc', ' */')),

    line(0, ostr(props === 'jsdoc', '/**')),
    line(0, ostr(props === 'jsdoc', ` * @type {${componentType}}`)),
    line(0, ostr(props === 'jsdoc', ' */')),

    line(0, `export const ${pcName}${cstr(TSProps, `: ${componentType}`)} = (${cstr(children, '{ children }')}) => {`),
    '',
    line(1, ostr(styling === 'jss' || styling === 'mui', 'const classes = useStyles();')),
    line(1, ostr(styling === 'jss' || styling === 'mui', '')),

    line(1, 'return ('),
    line(2, `${children ? '<div>{children}</div>' : '<div />'}`),
    line(1, ');'),
    line(0, '}'),
    line(0, ostr(props === 'prop-types', '')),
    line(0, ostr(props === 'prop-types', `${pcName}.propTypes = {}`))
  ].filter(line => typeof line === 'string').join('\n');
}
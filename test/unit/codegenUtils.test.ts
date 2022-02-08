import { createArrowFunction, createAssignment, createComment, createDefaultExport, createImport, declareConst, declareFunction, declareInterface, declareType } from '../../src/utils/codegenUtils';

describe('utils/codegenUtils.ts', () => {

  test('createImport', () => {
    expect(createImport('styles.css')).toBe("import 'styles.css';");
    expect(createImport('module')).toBe("import 'module';");

    expect(createImport('react', 'default', 'React')).toBe("import React from 'react';");
    expect(createImport('jsonwebtoken', 'default', 'jwt')).toBe("import jwt from 'jsonwebtoken';");

    expect(createImport('react', 'named', 'useMemo')).toBe("import { useMemo } from 'react';");
    expect(createImport('@material-ui/core', 'named', 'makeStyles')).toBe("import { makeStyles } from '@material-ui/core';");

    expect(createImport('react', 'composite', ['React', 'memo', 'useEffect'])).toBe("import React, { memo, useEffect } from 'react';");
    expect(createImport('m1', 'composite', ['defaultImport', 'ni1', 'ni2'])).toBe("import defaultImport, { ni1, ni2 } from 'm1';");
  });

  test('declareConst', () => {
    expect(declareConst('classes', 'useStyles()')).toBe('const classes = useStyles();');
    expect(declareConst('computed', 'useMemo(() => 3)')).toBe('const computed = useMemo(() => 3);');

    expect(declareConst('classes', 'useStyles()', true)).toBe('export const classes = useStyles();');
    expect(declareConst('computed', 'useMemo(() => 3)', true)).toBe('export const computed = useMemo(() => 3);');

    expect(declareConst('classes', 'useStyles()', false, 'Classes')).toBe('const classes: Classes = useStyles();');
    expect(declareConst('computed', 'useMemo(() => 3)', false, 'number')).toBe('const computed: number = useMemo(() => 3);');

    expect(declareConst('classes', 'useStyles()', true, 'Classes')).toBe('export const classes: Classes = useStyles();');
    expect(declareConst('computed', 'useMemo(() => 3)', true, 'number')).toBe('export const computed: number = useMemo(() => 3);');
  });

  test('declareInterface', () => {
    expect(declareInterface('ButtonProps')).toBe('interface ButtonProps {}');
    expect(declareInterface('TabProps')).toBe('interface TabProps {}');

    expect(declareInterface('ButtonProps', true)).toBe('export interface ButtonProps {}');
    expect(declareInterface('TabProps', true)).toBe('export interface TabProps {}');

  });

  test('declareType', () => {
    expect(declareType('ButtonProps')).toBe('type ButtonProps = {};');
    expect(declareType('TabProps')).toBe('type TabProps = {};');

    expect(declareType('ButtonProps', true)).toBe('export type ButtonProps = {};');
    expect(declareType('TabProps', true)).toBe('export type TabProps = {};');

  });

  test('declareFunction', () => {
    expect(declareFunction('Button')).toBe('function Button() { }');

    expect(declareFunction('Button', 'props: ButtonProps')).toBe('function Button(props: ButtonProps) { }');

    expect(declareFunction(
      'Button',
      '{ onClick }: ButtonProps',
      'return <button onClick={onClick} />'
    )).toBe('function Button({ onClick }: ButtonProps) {\n\treturn <button onClick={onClick} />\n}');

    expect(declareFunction(
      'Button',
      '{ onClick }: ButtonProps',
      'return <button onClick={onClick} />',
      true
    )).toBe('export function Button({ onClick }: ButtonProps) {\n\treturn <button onClick={onClick} />\n}');


    expect(declareFunction('Tab')).toBe('function Tab() { }');

    expect(declareFunction('Tab', '{ index }: TabProps')).toBe('function Tab({ index }: TabProps) { }');

    expect(declareFunction('Tab', '{ index }: TabProps', 'console.log(index);')).toBe('function Tab({ index }: TabProps) {\n\tconsole.log(index);\n}');

    expect(declareFunction(
      'Tab',
      '{ index }: TabProps',
      'console.log(index);',
      true
    )).toBe('export function Tab({ index }: TabProps) {\n\tconsole.log(index);\n}');

  });

  test('createArrowFunction', () => {
    expect(createArrowFunction()).toBe('() => {}');

    expect(createArrowFunction('param: number')).toBe('(param: number) => {}');

    expect(createArrowFunction('param: number', 'console.log(param);')).toBe('(param: number) => {\n\tconsole.log(param);\n}');
    expect(createArrowFunction('{ cb: () => void }', 'cb();')).toBe('({ cb: () => void }) => {\n\tcb();\n}');
  });

  test('createDefaultExport', () => {
    expect(createDefaultExport('Component')).toBe('export default Component;');
    expect(createDefaultExport('memo(Component)')).toBe('export default memo(Component);');
  });

  test('createComment', () => {
    expect(createComment('single', 'hello')).toBe('// hello');
    expect(createComment('single', 'this is a comment')).toBe('// this is a comment');

    expect(createComment('multi', 'hello')).toBe('/*\n * hello\n */');
    expect(createComment('multi', 'this is a comment')).toBe('/*\n * this is a comment\n */');

    expect(createComment('jsdoc', 'hello')).toBe('/**\n * hello\n */');
    expect(createComment('jsdoc', 'this is a comment')).toBe('/**\n * this is a comment\n */');
  });

  test('createAssignment', () => {
    expect(createAssignment('obj', 'a', '3')).toBe('obj.a = 3;');
    expect(createAssignment('Component', 'propTypes', '{}')).toBe('Component.propTypes = {};');
  });
});
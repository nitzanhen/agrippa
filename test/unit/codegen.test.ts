import assert from 'node:assert/strict';
import { createArrowFunction, createAssignment, createDefaultExport, declareConst, declareFunction, declareInterface, declareType } from '../../src/utils/codegen';

describe('utils/codegen.ts', () => {
  it('declareConst', () => {
    assert.equal(declareConst('classes', 'useStyles()'), 'const classes = useStyles();');
    assert.equal(declareConst('computed', 'useMemo(() => 3)'), 'const computed = useMemo(() => 3);');

    assert.equal(declareConst('classes', 'useStyles()', true), 'export const classes = useStyles();');
    assert.equal(declareConst('computed', 'useMemo(() => 3)', true), 'export const computed = useMemo(() => 3);');

    assert.equal(declareConst('classes', 'useStyles()', false, 'Classes'), 'const classes: Classes = useStyles();');
    assert.equal(declareConst('computed', 'useMemo(() => 3)', false, 'number'), 'const computed: number = useMemo(() => 3);');

    assert.equal(declareConst('classes', 'useStyles()', true, 'Classes'), 'export const classes: Classes = useStyles();');
    assert.equal(declareConst('computed', 'useMemo(() => 3)', true, 'number'), 'export const computed: number = useMemo(() => 3);');
  });

  it('declareInterface', () => {
    assert.equal(declareInterface('ButtonProps'), 'interface ButtonProps {}');
    assert.equal(declareInterface('TabProps'), 'interface TabProps {}');

    assert.equal(declareInterface('ButtonProps', true), 'export interface ButtonProps {}');
    assert.equal(declareInterface('TabProps', true), 'export interface TabProps {}');

  });

  it('declareType', () => {
    assert.equal(declareType('ButtonProps'), 'type ButtonProps = {};');
    assert.equal(declareType('TabProps'), 'type TabProps = {};');

    assert.equal(declareType('ButtonProps', true), 'export type ButtonProps = {};');
    assert.equal(declareType('TabProps', true), 'export type TabProps = {};');

  });

  it('declareFunction', () => {
    assert.equal(declareFunction('Button'), 'function Button() { }');

    assert.equal(declareFunction('Button', 'props: ButtonProps'), 'function Button(props: ButtonProps) { }');

    assert.equal(declareFunction(
      'Button',
      '{ onClick }: ButtonProps',
      'return <button onClick={onClick} />'
    ), 'function Button({ onClick }: ButtonProps) {\n\treturn <button onClick={onClick} />\n}');

    assert.equal(declareFunction(
      'Button',
      '{ onClick }: ButtonProps',
      'return <button onClick={onClick} />',
      true
    ), 'export function Button({ onClick }: ButtonProps) {\n\treturn <button onClick={onClick} />\n}');


    assert.equal(declareFunction('Tab'), 'function Tab() { }');

    assert.equal(declareFunction('Tab', '{ index }: TabProps'), 'function Tab({ index }: TabProps) { }');

    assert.equal(declareFunction('Tab', '{ index }: TabProps', 'console.log(index);'), 'function Tab({ index }: TabProps) {\n\tconsole.log(index);\n}');

    assert.equal(declareFunction(
      'Tab',
      '{ index }: TabProps',
      'console.log(index);',
      true
    ), 'export function Tab({ index }: TabProps) {\n\tconsole.log(index);\n}');

  });

  it('createArrowFunction', () => {
    assert.equal(createArrowFunction(), '() => {}');

    assert.equal(createArrowFunction('param: number'), '(param: number) => {}');

    assert.equal(createArrowFunction('param: number', 'console.log(param);'), '(param: number) => {\n\tconsole.log(param);\n}');
    assert.equal(createArrowFunction('{ cb: () => void }', 'cb();'), '({ cb: () => void }) => {\n\tcb();\n}');
  });

  it('createDefaultExport', () => {
    assert.equal(createDefaultExport('Component'), 'export default Component;');
    assert.equal(createDefaultExport('memo(Component)'), 'export default memo(Component);');
  });

  it('createAssignment', () => {
    assert.equal(createAssignment('obj', 'a', '3'), 'obj.a = 3;');
    assert.equal(createAssignment('Component', 'propTypes', '{}'), 'Component.propTypes = {};');
  });
});
import assert from 'node:assert/strict';
import { capitalize, cstr, indent, isCamelCase, isKebabCase, isLowerCase, isPascalCase, joinLines, kebabCase, ostr, pascalCase } from '../../src/utils/strings';

describe('strings', () => {

  it('ostr', () => {
    assert.equal(ostr(true, 'abc'), 'abc');
    assert.equal(ostr(false, 'abc'), null);
  });

  it('cstr', () => {
    assert.equal(cstr(true, 'abc'), 'abc');
    assert.equal(cstr(false, 'abc'), '');
  });

  it('indent', () => {
    assert.equal(indent('x'), '\tx');
    assert.equal(indent('x', 2), '\t\tx');
    assert.equal(indent('\t'), '\t\t');
    assert.equal(indent('x\ny\nz'), '\tx\n\ty\n\tz');
    assert.equal(indent('x\ny\nz', 3), '\t\t\tx\n\t\t\ty\n\t\t\tz');

    assert.equal(indent('x', 1, '  '), '  x');
    assert.equal(indent('x', 2, '  '), '    x');
    assert.equal(indent('\t', 1, '  '), '  \t');
    assert.equal(indent('x\ny\nz', 1, '  '), '  x\n  y\n  z');
    assert.equal(indent('x\ny\nz', 3, '  '), '      x\n      y\n      z');
  });

  it('joinLines', () => {
    assert.equal(joinLines('x'), 'x');
    assert.equal(joinLines(false), '');

    assert.equal(joinLines('x', 'y'), 'x\ny');
    assert.equal(joinLines('x', false, 'y'), 'x\ny');

    assert.equal(joinLines('x', 'y', 'z', 'xx', 'yy'), 'x\ny\nz\nxx\nyy');
    assert.equal(joinLines('x', 'y', false, 'xx', 0 > 1 && 'z'), 'x\ny\nxx');
  });

  it('isLowerCase', () => {
    assert.equal(isLowerCase(''), true);
    assert.equal(isLowerCase('abc'), true);
    assert.equal(isLowerCase('aBc'), false);
    assert.equal(isLowerCase('Ω'), false);
    assert.equal(isLowerCase('the Quick brown fox'), false);
    assert.equal(isLowerCase('the quick brown fox'), true);
  });

  it('capitalize', () => {
    assert.equal(capitalize(''), '');
    assert.equal(capitalize('abc'), 'Abc');
    assert.equal(capitalize('aBc'), 'ABc');
    assert.equal(capitalize('Ω'), 'Ω');
    assert.equal(capitalize('ωΩ'), 'ΩΩ');
    assert.equal(capitalize('the Quick brown fox'), 'The Quick brown fox');
  });

  it('isKebabCase', () => {
    assert.equal(isKebabCase(''), true);

    assert.equal(isKebabCase('first-last'), true);
    assert.equal(isKebabCase('First-last'), false);
    assert.equal(isKebabCase('First-Last'), false);

    assert.equal(isKebabCase('firstLast'), false);
    assert.equal(isKebabCase('FirstLast'), false);

    assert.equal(isKebabCase('First'), false);
    assert.equal(isKebabCase('first'), true);

    assert.equal(isKebabCase('name-2'), true);
    assert.equal(isKebabCase('name2'), true);
    assert.equal(isKebabCase('Name2'), false);
  });

  it('isCamelCase', () => {
    assert.equal(isCamelCase(''), true);

    assert.equal(isCamelCase('first-last'), false);
    assert.equal(isCamelCase('First-last'), false);
    assert.equal(isCamelCase('First-Last'), false);

    assert.equal(isCamelCase('firstLast'), true);
    assert.equal(isCamelCase('FirstLast'), false);

    assert.equal(isCamelCase('First'), false);
    assert.equal(isCamelCase('first'), true);

    assert.equal(isCamelCase('name-2'), false);
    assert.equal(isCamelCase('name2'), true);
    assert.equal(isCamelCase('Name2'), false);
  });

  it('isPascalCase', () => {
    assert.equal(isPascalCase(''), true);

    assert.equal(isPascalCase('first-last'), false);
    assert.equal(isPascalCase('First-last'), false);
    assert.equal(isPascalCase('First-Last'), false);

    assert.equal(isPascalCase('firstLast'), false);
    assert.equal(isPascalCase('FirstLast'), true);

    assert.equal(isPascalCase('First'), true);
    assert.equal(isPascalCase('first'), false);

    assert.equal(isPascalCase('name-2'), false);
    assert.equal(isPascalCase('name2'), false);
    assert.equal(isPascalCase('Name2'), true);
  });

  it('pascalCase', () => {
    assert.equal(pascalCase(''), '');

    assert.equal(pascalCase('first-last'), 'FirstLast');
    assert.throws(() => pascalCase('First-last'), RangeError);
    assert.throws(() => pascalCase('First-Last'), RangeError);

    assert.equal(pascalCase('firstLast'), 'FirstLast');
    assert.equal(pascalCase('FirstLast'), 'FirstLast');

    assert.equal(pascalCase('First'), 'First');
    assert.equal(pascalCase('first'), 'First');

    assert.equal(pascalCase('name-2'), 'Name2');
    assert.equal(pascalCase('name2'), 'Name2');
    assert.equal(pascalCase('Name2'), 'Name2');
  });

  it('kebabCase', () => {
    assert.equal(kebabCase(''), '');

    assert.equal(kebabCase('first-last'), 'first-last');
    assert.throws(() => kebabCase('First-last'), RangeError);
    assert.throws(() => kebabCase('First-Last'), RangeError);

    assert.equal(kebabCase('firstLast'), 'first-last');
    assert.equal(kebabCase('FirstLast'), 'first-last');

    assert.equal(kebabCase('First'), 'first');
    assert.equal(kebabCase('first'), 'first');

    assert.equal(kebabCase('name-2'), 'name-2');
    assert.equal(kebabCase('name2'), 'name2');
    assert.equal(kebabCase('Name2'), 'name2');
  });
});
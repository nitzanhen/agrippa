
import { capitalize, cstr, indent, isCamelCase, isKebabCase, isLowerCase, isPascalCase, joinLines, kebabCase, ostr, pascalCase } from '../../src/utils/strings';

describe('strings', () => {

  test('ostr', () => {
    expect(ostr(true, 'abc')).toBe('abc');
    expect(ostr(false, 'abc')).toBe(null);
  });

  test('cstr', () => {
    expect(cstr(true, 'abc')).toBe('abc');
    expect(cstr(false, 'abc')).toBe('');
  });

  test('indent', () => {
    expect(indent('x')).toBe('\tx');
    expect(indent('x', 2)).toBe('\t\tx');
    expect(indent('\t')).toBe('\t\t');
    expect(indent('x\ny\nz')).toBe('\tx\n\ty\n\tz');
    expect(indent('x\ny\nz', 3)).toBe('\t\t\tx\n\t\t\ty\n\t\t\tz');

    expect(indent('x', 1, '  ')).toBe('  x');
    expect(indent('x', 2, '  ')).toBe('    x');
    expect(indent('\t', 1, '  ')).toBe('  \t');
    expect(indent('x\ny\nz', 1, '  ')).toBe('  x\n  y\n  z');
    expect(indent('x\ny\nz', 3, '  ')).toBe('      x\n      y\n      z');
  });

  test('joinLines', () => {
    expect(joinLines('x')).toBe('x');
    expect(joinLines(false)).toBe('');

    expect(joinLines('x', 'y')).toBe('x\ny');
    expect(joinLines('x', false, 'y')).toBe('x\ny');

    expect(joinLines('x', 'y', 'z', 'xx', 'yy')).toBe('x\ny\nz\nxx\nyy');
    expect(joinLines('x', 'y', false, 'xx', 0 > 1 && 'z')).toBe('x\ny\nxx');
  });

  test('isLowerCase', () => {
    expect(isLowerCase('')).toBe(true);
    expect(isLowerCase('abc')).toBe(true);
    expect(isLowerCase('aBc')).toBe(false);
    expect(isLowerCase('Ω')).toBe(false);
    expect(isLowerCase('the Quick brown fox')).toBe(false);
    expect(isLowerCase('the quick brown fox')).toBe(true);
  });

  test('capitalize', () => {
    expect(capitalize('')).toBe('');
    expect(capitalize('abc')).toBe('Abc');
    expect(capitalize('aBc')).toBe('ABc');
    expect(capitalize('Ω')).toBe('Ω');
    expect(capitalize('ωΩ')).toBe('ΩΩ');
    expect(capitalize('the Quick brown fox')).toBe('The Quick brown fox');
  });

  test('isKebabCase', () => {
    expect(isKebabCase('')).toBe(true);

    expect(isKebabCase('first-last')).toBe(true);
    expect(isKebabCase('First-last')).toBe(false);
    expect(isKebabCase('First-Last')).toBe(false);

    expect(isKebabCase('firstLast')).toBe(false);
    expect(isKebabCase('FirstLast')).toBe(false);

    expect(isKebabCase('First')).toBe(false);
    expect(isKebabCase('first')).toBe(true);

    expect(isKebabCase('name-2')).toBe(true);
    expect(isKebabCase('name2')).toBe(true);
    expect(isKebabCase('Name2')).toBe(false);
  });

  test('isCamelCase', () => {
    expect(isCamelCase('')).toBe(true);

    expect(isCamelCase('first-last')).toBe(false);
    expect(isCamelCase('First-last')).toBe(false);
    expect(isCamelCase('First-Last')).toBe(false);

    expect(isCamelCase('firstLast')).toBe(true);
    expect(isCamelCase('FirstLast')).toBe(false);

    expect(isCamelCase('First')).toBe(false);
    expect(isCamelCase('first')).toBe(true);

    expect(isCamelCase('name-2')).toBe(false);
    expect(isCamelCase('name2')).toBe(true);
    expect(isCamelCase('Name2')).toBe(false);
  });

  test('isPascalCase', () => {
    expect(isPascalCase('')).toBe(true);

    expect(isPascalCase('first-last')).toBe(false);
    expect(isPascalCase('First-last')).toBe(false);
    expect(isPascalCase('First-Last')).toBe(false);

    expect(isPascalCase('firstLast')).toBe(false);
    expect(isPascalCase('FirstLast')).toBe(true);

    expect(isPascalCase('First')).toBe(true);
    expect(isPascalCase('first')).toBe(false);

    expect(isPascalCase('name-2')).toBe(false);
    expect(isPascalCase('name2')).toBe(false);
    expect(isPascalCase('Name2')).toBe(true);
  });

  test('pascalCase', () => {
    expect(pascalCase('')).toBe('');

    expect(pascalCase('first-last')).toBe('FirstLast');
    expect(() => pascalCase('First-last')).toThrow(RangeError);
    expect(() => pascalCase('First-Last')).toThrow(RangeError);

    expect(pascalCase('firstLast')).toBe('FirstLast');
    expect(pascalCase('FirstLast')).toBe('FirstLast');

    expect(pascalCase('First')).toBe('First');
    expect(pascalCase('first')).toBe('First');

    expect(pascalCase('name-2')).toBe('Name2');
    expect(pascalCase('name2')).toBe('Name2');
    expect(pascalCase('Name2')).toBe('Name2');
  });

  test('kebabCase', () => {
    expect(kebabCase('')).toBe('');

    expect(kebabCase('first-last')).toBe('first-last');
    expect(() => kebabCase('First-last')).toThrow(RangeError);
    expect(() => kebabCase('First-Last')).toThrow(RangeError);

    expect(kebabCase('firstLast')).toBe('first-last');
    expect(kebabCase('FirstLast')).toBe('first-last');

    expect(kebabCase('First')).toBe('first');
    expect(kebabCase('first')).toBe('first');

    expect(kebabCase('name-2')).toBe('name-2');
    expect(kebabCase('name2')).toBe('name2');
    expect(kebabCase('Name2')).toBe('name2');
  });
});
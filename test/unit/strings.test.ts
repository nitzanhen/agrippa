import { formatWithOptions } from 'util';

import { capitalize, cstr, emptyLine, format, indent, isCamelCase, isKebabCase, isLowerCase, isPascalCase, joinLines, kebabCase, ostr, pascalCase } from 'utils/strings';

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
  });

  test('format', () => {
    ['a', { a: 3 }, 3, [true, false, {}]].forEach((x) => {
      expect(format(x)).toBe(formatWithOptions({ colors: true }, x));
    });
  });

  test('emptyLine', () => {
    expect(emptyLine()).toBe('');
  });
});
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  modulePathIgnorePatterns: ['<rootDir>/bin/'],
  roots: [
    'test'
  ],
  globals: {
    'ts-jest': {
      tsconfig: './test/tsconfig.json'
    }
  }
};
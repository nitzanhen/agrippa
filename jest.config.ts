/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/bin/'],
  roots: [
    'test/unit',
    'test/integration'
  ],
  globals: {
    'ts-jest': {
      tsconfig: './test/tsconfig.json'
    }
  }
};
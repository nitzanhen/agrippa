import { InputConfig, run } from '../../src';
import { cstr } from '../../src/utils';
import testCases from './test-cases';

/**
 * Option overrides for integration tests.
 */
const configOverrides: Partial<InputConfig> = {
  pure: true,
  lookForUpdates: false,
  reportUsageStatistics: false
};

describe.each(testCases)('Case $#: $name', ({ input, output: expectedOutput }) => {
  const { config, options } = input;

  let output: Awaited<ReturnType<typeof run>>;

  test('Agrippa process runs successfully', async () => {
    output = await run({
      ...config,
      ...configOverrides
    }, options);

    console.log(output);
  });

  const testConfig = expectedOutput.config ? test : test.skip;
  testConfig(`Resolved config matches test data${cstr(!expectedOutput.config, ' (no config data)')}`, () => {
    expect(output.config).toMatchObject(expectedOutput.config!);
  });

  const testDirs = expectedOutput.createdDirs ? test : test.skip;
  testDirs(`Created directories match test data${cstr(!expectedOutput.createdDirs, ' (no direcory data)')}`, () => {
    expect(output.createdDirs).toEqual(expectedOutput.createdDirs);
  });

  const testFiles = expectedOutput.createdFiles ? test : test.skip;
  testFiles(`Created files match test data${cstr(!expectedOutput.createdFiles, ' (no file data)')}`, () => {
    expect(output.createdFiles).toEqual(expectedOutput.createdFiles);
  });

  const testVariables = expectedOutput.variables ? test : test.skip;
  testVariables(`Resolved variables match test data${cstr(!expectedOutput.variables, ' (no variable data)')}`, () => {
    expect(output.variables).toMatchObject(expectedOutput.variables!);
  });
});



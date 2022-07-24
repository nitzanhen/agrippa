import { join } from 'path';
import { execSync } from 'child_process';
import { strict as assert } from 'assert';
import { mkdirSync, readdirSync, readFileSync } from 'fs';
import { sync as globSync } from 'fast-glob';

/** Simple representation of a file found in an integration test case */
interface TestFile {
  path: string;
  data: string;
}
/** Simple representation of a directory found in an integration test case */
interface TestDir {
  path: string;
}

/** The files and dirs returned from scanDir(). */
interface ScannedDir {
  files: TestFile[];
  dirs: TestDir[];
}
/** The data returned from runCase(); contains the scanned solution and output directories, ready to be compared. */
interface TestCase {
  name: string;
  solution: ScannedDir;
  output: ScannedDir;
}
/** The structure of a testinfo.json file for a given test case. */
interface TestInfo {
  name: string;
  description?: string;
  command: string;
}

const isTestFile = (ent: TestFile | TestDir): ent is TestFile => 'data' in ent;

/** 
 * Scans the directory resolved from the given path.
 * Returns all files and folders in that directory, as a `ScannedDir` object.
 */
const scanDir = (dirPath: string): ScannedDir => {
  const paths = globSync('**/*', {
    cwd: dirPath,
    onlyFiles: false,
    markDirectories: true,
  });

  const entities: (TestFile | TestDir)[] =
    paths.map(path => path.endsWith('/')
      ? { path }
      : { path, data: readFileSync(join(dirPath, path), 'utf-8') }
    );

  const grouped = entities.reduce(({ files, dirs }, ent) =>
    isTestFile(ent)
      ? { files: [...files, ent], dirs }
      : { files, dirs: [...dirs, ent] },
    { files: [] as TestFile[], dirs: [] as TestDir[] }
  );

  return grouped;
};


/** 
 * Runs a test case, specified by its name. 
 * This entails:
 * - Scanning the solution dir & testinfo.json
 * - Creating an output directory and running the Agrippa command there
 * - Scanning the output directory after the command finished
 */
const runCase = (caseName: string): TestCase => {
  const casePath = join(__dirname, caseName);

  //Scan solution files & dirs

  const solutionDir = join(casePath, 'solution');
  const solution = scanDir(solutionDir);

  let testInfo: TestInfo;
  try {
    testInfo = JSON.parse(
      readFileSync(join(casePath, 'testinfo.json'), 'utf-8')
    );
  }
  catch (e) {
    throw new Error(`Reading testinfo.json failed for case ${caseName}. Please make sure the file exists.`);
  }

  const { name, command } = testInfo;

  // Run Agrippa & scan output files

  const outputDir = join(casePath, 'output');
  try {
    mkdirSync(outputDir);
  }
  catch (e) {
    if (e.code !== 'EEXIST') {
      console.warn(`output directory for case ${caseName} already exists.`);
      throw e;
    }
  }

  try {
    execSync(command, { cwd: outputDir, encoding: 'utf-8', stdio: 'inherit' });
  }
  catch (e) {
    console.error(e);
  }

  const output = scanDir(outputDir);

  return { name, solution, output };
};

const caseNames = readdirSync(__dirname, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .slice(0, 1);

const testCases: TestCase[] = caseNames.map(caseName => runCase(caseName));

describe('End-to-end tests', () => {

  for (let i = 0; i < caseNames.length; i++) {
    const caseName = caseNames[i];
    describe(`Case ${i}: ${caseName}`, () => {

      const { solution, output } = testCases[i];

      // Compare solution & output

      it('Solution and output have the same number of directories', () => {
        assert.equal(output.dirs.length, solution.dirs.length);
      });

      it('Solution and output have the same number of files', () => {
        assert.equal(output.files.length, solution.files.length);
      });


      const outputDirPaths = output.dirs.map(d => d.path);
      for (const dir of solution.dirs) {
        const { path } = dir;

        it(`Dir ${path} generated`, () => {
          assert.ok(outputDirPaths.includes(path));
        });
      }

      for (const file of solution.files) {
        const { path, data } = file;

        const outputFile = output.files.find(f => f.path === path);

        it(`File ${path} matches solution`, () => {
          assert.ok(outputFile);
          assert.equal(outputFile?.data, data);
        });
      }
    });
    i++;
  }

});
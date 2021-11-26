import { join } from 'path';
import { mkdir } from 'fs/promises';
import { execSync } from 'child_process';
import { readdirSync, readFileSync } from 'fs';
import { sync as fgSync } from 'fast-glob';

const safeTry = <T>(fn: () => T): { ok: true, data: T } | { ok: false, err: Error } => {
  try {
    return { ok: true, data: fn() };
  }
  catch (e) {
    return { ok: false, err: e };
  }
};

interface TestFile {
  path: string;
  data: string;
}
interface TestDir {
  path: string;
}
interface ScannedDir {
  files: TestFile[];
  dirs: TestDir[];
}
interface TestCase {
  name: string;
  solution: ScannedDir;
  output: ScannedDir;
}
interface TestInfo {
  name: string;
  description?: string;
  command: string;
}

const isTestFile = (ent: TestFile | TestDir): ent is TestFile => 'data' in ent;

const scanDir = (dirPath: string): ScannedDir =>
  fgSync('**/*', {
    cwd: dirPath,
    onlyFiles: false,
    markDirectories: true,
  })
    .map(path =>
      path.endsWith('/')
        ? { path }
        : {
          path,
          data: readFileSync(join(dirPath, path), 'utf-8')
        }
    )
    .reduce(({ files, dirs }, ent) =>
      isTestFile(ent)
        ? { files: [...files, ent], dirs }
        : { files, dirs: [...dirs, ent] },
      { files: [] as TestFile[], dirs: [] as TestDir[] }
    );

const runCase = (caseName: string): TestCase => {
  const casePath = join(__dirname, caseName);

  //Scan solution files & dirs

  const solutionDir = join(casePath, 'solution');
  const solution = scanDir(solutionDir);

  const testInfo = safeTry(() =>
    JSON.parse(
      readFileSync(join(casePath, 'testinfo.json'), 'utf-8')
    ) as TestInfo
  );

  if (!testInfo.ok) {
    throw new Error(`Reading testinfo.json failed for case ${caseName}. Please make sure the file exists.`);
  }

  const { name, command } = testInfo.data;

  // Run Agrippa & scan output files

  const outputDir = join(casePath, 'output');
  mkdir(outputDir);

  const logs = safeTry(() => execSync(command, { cwd: outputDir }));
  if (logs.ok) {
    console.log(logs.data.toString());
  }
  else {
    console.error((logs as any).err);
  }

  const output = scanDir(outputDir);

  return { name, solution, output };
};

const caseNames = readdirSync(__dirname, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

describe.each(caseNames)('Case %#: %s', (name) => {
  const { solution, output } = runCase(name);

  // Compare solution & output

  test('Solution and output have the same number of directories', () => {
    expect(solution.dirs.length).toBe(output.dirs.length);
  });

  test('Solution and output have the same number of files', () => {
    expect(solution.files.length).toBe(output.files.length);
  });

  test.each(solution.dirs)('Dir $path generated', ({ path }) => {
    const outputDirPaths = new Set(output.dirs.map(d => d.path));

    expect(outputDirPaths.has(path)).toBe(true);
  });

  test.each(solution.files)('File $path generated', ({ path, data }) => {
    const outputFile = output.files.find(f => f.path === path);

    expect(outputFile).toBeTruthy();
    expect(outputFile?.data).toEqual(data);
  });
});
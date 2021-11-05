import { exec as execCB } from 'child_process';
import { mkdir } from 'fs/promises';
import { promisify } from 'util';
import { scanCodeFiles } from './CodeFile';
import { TestCase } from './TestCase';

// export interface ExecPayload {
//   error: ExecException | null;
//   stdout: string;
//   stderr: string;
// }
// const exec = (command: string, options?: ExecOptions) => new Promise<ExecPayload>(
//   (resolve, reject) => {
//     execCB(command, options, (error, stdout, stderr) =>
//       error?.code
//         ? reject({ error, stdout: stdout as string, stderr: stderr as string })
//         : resolve({ error, stdout: stdout as string, stderr: stderr as string })
//     );
//   }
// );

const exec = promisify(execCB);

export async function runTest({ command }: TestCase, outPath: string) {
  await mkdir(outPath);
  await exec(command, { cwd: outPath });

  const outFiles = await scanCodeFiles(outPath);
  console.log(outFiles);
}
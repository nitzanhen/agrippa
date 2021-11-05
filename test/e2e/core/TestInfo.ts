import { readFile } from 'fs/promises';
import { getAgrippaRoot } from './getAgrippaRoot';

export const TEST_INFO_FILENAME = 'testinfo.json';

export interface TestInfo {
  name: string;
  description?: string;
  command: string;
}

export const fetchTestInfo = async (path: string): Promise<TestInfo> => {
  const infoJson = JSON.parse(await readFile(path, 'utf-8'));
  const { name, command: commandRaw, description } = infoJson;
  if (
    typeof name !== 'string'
    || typeof commandRaw !== 'string'
    || (description && typeof description !== 'string')
  ) {
    throw new Error(`testinfo.json at ${path} must have 'name' and 'command' fields, and an optional 'description' field, all of which must be strings.`);
  }

  const command = commandRaw.replace('<agrippa>', await getAgrippaRoot());

  return { name, command, description };
};
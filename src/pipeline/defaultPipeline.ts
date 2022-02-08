import { join } from 'path';
import { cwd } from 'process';
import { Config } from '..';
import { Agrippa } from '../utils';
import { createDir } from './createDir';
import { createFile } from './createFile';
import { Pipeline } from './Pipeline';
import { loadFiles } from './loadFiles';


export const defaultPipeline = (config: Config): Pipeline => [
  createDir({ path: join(cwd(), 'Shir') }),
  createFile(new Agrippa.File(
    join(cwd(), 'Shir'),
    'index',
    'ts',
    'hiiiii'
  )),
];
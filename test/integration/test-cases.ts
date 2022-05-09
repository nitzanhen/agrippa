import { join } from 'path';
import { AgrippaDir, AgrippaFile, Config, InputConfig, RunOptions } from '../../src';
import { DeepPartial } from '../../src/utils';

export interface IntegrationTestCase {
  name: string;
  description?: string;
  tags?: string[];
  input: {
    config: InputConfig,
    options?: RunOptions
  },
  output: {
    config?: DeepPartial<Config>
    createdFiles?: AgrippaFile[],
    createdDirs?: AgrippaDir[],
    variables?: Record<string, any>
  }
}

const cwd = process.cwd();

const testCases: IntegrationTestCase[] = [
  {
    name: 'react',
    description: 'Bare React test',
    tags: ['React'],
    input: {
      config: {
        name: 'react-component',
        environment: 'react'
      }
    },
    output: {
      config: {
        name: 'ReactComponent',
        environment: 'react',
      },
      createdDirs: [
        new AgrippaDir(
          join(cwd, 'ReactComponent')
        )
      ],
      createdFiles: [
        new AgrippaFile(
          join(cwd, 'ReactComponent', 'ReactComponent.jsx'),
          "import React from 'react';\n" +
          '\n' +
          'export const ReactComponent = (props) => {\n' +
          '\t\n' +
          '\treturn (\n' +
          '\t\t<div></div>\n' +
          '\t);\n' +
          '};'
        ),
        new AgrippaFile(
          join(cwd, 'ReactComponent', 'index.js'),
          "export * from './ReactComponent';"
        )
      ],
      variables: {
        ComponentName: 'ReactComponent',
        'component-name': 'react-component',
        dirPath: join(cwd, 'ReactComponent'),
        componentPath: join(cwd, 'ReactComponent', 'ReactComponent.jsx'),
        indexPath: join(cwd, 'ReactComponent', 'index.js')
      }
    }
  },
  {
    name: 'react-ts',
    description: 'Basic React+TS test',
    tags: ['React', 'Typescript'],
    input: {
      config: {
        name: 'react-ts-component',
        environment: 'react',
        typescript: true
      }
    },
    output: {
      config: {
        name: 'ReactTsComponent',
        environment: 'react',
        typescript: true,
      },
      createdDirs: [
        new AgrippaDir(
          join(cwd, 'ReactTsComponent')
        )
      ],
      createdFiles: [
        new AgrippaFile(
          join(cwd, 'ReactTsComponent', 'ReactTsComponent.tsx'),
          "import React from 'react';\n" +
          '\n' +
          'export interface ReactTsComponentProps {}\n' +
          '\n' +
          'export const ReactTsComponent = (props: ReactTsComponentProps) => {\n' +
          '\t\n' +
          '\treturn (\n' +
          '\t\t<div></div>\n' +
          '\t);\n' +
          '};'
        ),
        new AgrippaFile(
          join(cwd, 'ReactTsComponent', 'index.ts'),
          "export * from './ReactTsComponent';"
        )
      ],
      variables: {
        ComponentName: 'ReactTsComponent',
        'component-name': 'react-ts-component',
        dirPath: join(cwd, 'ReactTsComponent'),
        componentPath: join(cwd, 'ReactTsComponent', 'ReactTsComponent.tsx'),
        indexPath: join(cwd, 'ReactTsComponent', 'index.ts')
      }
    }
  }
];

export default testCases;
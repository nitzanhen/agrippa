import esbuild from 'rollup-plugin-esbuild';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';

import packageJson from './package.json';

export default [
  {
    external: Object.keys(packageJson.dependencies),
    input: 'src/index.ts',
    plugins: [
      nodeResolve(),
      commonJs(),
      esbuild({
        target: 'es2015',
        minify: true,
      })
    ],
    output: {
      banner: '#!/usr/bin/env node',
      file: 'bin/index.js',
      format: 'cjs',
    },
  }
];
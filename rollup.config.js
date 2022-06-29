import { join } from 'path';
import { defineConfig } from 'rollup';
import eslint from '@rollup/plugin-eslint';
import esbuild from 'rollup-plugin-esbuild';
import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkgJson from './package.json';

const src = join(__dirname, 'src');
const dist = join(__dirname, 'dist');

const externals = ['yargs/helpers', 'fs/promises', ...Object.keys(pkgJson.dependencies)];

const plugins = ({ tsc = false } = {}) => [
  nodeResolve(),
  eslint({
    throwOnError: true,
    include: 'src'
  }),
  tsc && ts(),
  json(),
  esbuild({ target: 'es2020' })
];

export default defineConfig([
  {
    // main step
    input: join(src, 'index.ts'),
    external: externals,
    plugins: plugins({ tsc: true }),
    output: {
      file: join(dist, 'index.mjs'),
      format: 'es',
    }
  },
  {
    // cjs step
    input: join(src, 'index.ts'),
    external: externals,
    plugins: plugins(),
    output: {
      file: join(dist, 'index.cjs'),
      format: 'cjs',
    }
  },
  {
    // bin step
    input: join(src, 'cli', 'index.ts'),
    external: externals,
    plugins: plugins(),
    output: {
      file: join(__dirname, 'bin', 'index.mjs'),
      banner: '#!/usr/bin/env node',
      format: 'es'
    },

  }
]);
import { join } from 'path';
import { defineConfig } from 'rollup';
import eslint from '@rollup/plugin-eslint';
import esbuild from 'rollup-plugin-esbuild';
import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';
import { entries, map, pipe, toObject, tuple } from 'rhax';
import pkgJson from './package.json';

const src = join(__dirname, 'src');
const dist = join(__dirname, 'dist');

const externals = [Object.keys(pkgJson.dependencies)];
const globals = {};

const isDev = process.env.ROLLUP_WATCH === 'true';

// eslint-disable-next-line
const envConfig = dotenv.config({ override: false }).parsed;
if (!envConfig) {
  throw new Error('missing .env!');
}
const env = pipe(envConfig)
  (entries)
  (map(([key, v]) => tuple(`process.env.${key}`, JSON.stringify(v))))
  (toObject)
  .go();

env['process.env.IS_DEV'] = JSON.stringify(isDev);

const plugins = [
  eslint({
    throwOnError: true,
    include: 'src'
  }),
  replace({
    values: env,
    preventAssignment: true
  }),
  !isDev && ts(),
  json(),
  esbuild(),
];

export default defineConfig([
  {
    // main step
    input: join(src, 'index.ts'),
    external: externals,
    plugins,
    output: [{
      file: join(dist, 'index.mjs'),
      format: 'es',
    }, {
      file: join(dist, 'index.js'),
      format: 'umd',
      name: 'agrippa',
      globals
    }]
  },
  {
    // bin step
    input: join(src, 'cli', 'index.ts'),
    external: externals,
    plugins,
    output: {
      file: join(__dirname, 'bin', 'index.js'),
      banner: '#!/usr/bin/env node',
      format: 'umd'
    },

  }
]);
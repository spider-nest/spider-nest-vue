import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import vue from 'rollup-plugin-vue'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import replace from '@rollup/plugin-replace'
import filesize from 'rollup-plugin-filesize'

import { snOutput, snRoot } from '../utils/paths.mjs'
import { getExternal, writeBundles } from '../utils/rollup.mjs'

import spiderNestVueAlias from '../plugins/alias.mjs'
import reporter from '../plugins/reporter.mjs'

import { version } from '../../packages/spider-nest-vue/version.mjs'

const spinner = ora()

const main = async (minify = false) => {
  const bundle = await rollup({
    input: path.resolve(snRoot, 'index.ts'),
    plugins: [
      await spiderNestVueAlias(),
      nodeResolve({
        extensions: ['.js', '.ts'],
      }),
      vue({
        target: 'browser',
        exposeFilename: false,
      }),
      commonjs(),
      esbuild({
        minify,
        sourceMap: minify,
        target: 'esnext',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      filesize({ reporter }),
    ],
    external: await getExternal({ full: true }),
  })
  const banner = `/*! Spider Nest Vue v${version} */\n`
  const file = `dist/index.full${minify ? '.min' : ''}`
  return await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(snOutput, `${file}.js`),
      exports: 'named',
      name: 'SpiderNestVue',
      globals: {
        vue: 'Vue',
      },
      sourcemap: minify,
      banner,
    },
    {
      format: 'esm',
      file: path.resolve(snOutput, `${file}.mjs`),
      sourcemap: minify,
      banner,
    },
  ])
}

export default function buildFullBundleTask() {
  return new Promise((resolve) => {
    spinner.start(chalk.blue('Full Bundle Building...'))
    Promise.all([main(true), main()]).then(([flag1, flag2]) => {
      if (!flag1 || !flag2) return resolve(false)
      spinner.succeed(chalk.green('Build Full Bundle OK!'))
      resolve(true)
    })
  })
}

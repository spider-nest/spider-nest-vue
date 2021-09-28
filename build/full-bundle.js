import path from 'path'
import fs from 'fs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import replace from '@rollup/plugin-replace'
import { parallel, series } from 'gulp'

import { RollupResolveEntryPlugin } from './rollup-plugin-entry'
import { epRoot, epOutput } from './utils/paths'
import { SN_PREFIX, excludes } from './constants'
import { yellow, green } from './utils/log'
import { run } from './utils/process'
import { generateExternal, writeBundles } from './utils/rollup'
import { buildConfig } from './info'

let config

const init = async () =>
  (config = {
    input: path.resolve(epRoot, 'index.js'),
    plugins: [
      nodeResolve(),
      vue({
        target: 'browser',
        // css: false,
        exposeFilename: false,
      }),
      commonjs(),
      esbuild({ minify: false }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
    external: await generateExternal({ full: true }),
  })

export const buildFull = async () => {
  yellow('Building bundle')

  // Full bundle generation
  const bundle = await rollup({
    ...config,
    plugins: [...config.plugins, RollupResolveEntryPlugin()],
  })

  yellow('Generating index.full.js')
  await bundle.write({
    format: 'umd',
    file: path.resolve(epOutput, 'dist/index.full.js'),
    exports: 'named',
    name: 'SpiderNestVue',
    globals: {
      vue: 'Vue',
    },
  })
  green('index.full.js generated')
}

export const buildEntry = async () => {
  yellow('Generating entry files without dependencies')

  const entryFiles = await fs.promises.readdir(epRoot, {
    withFileTypes: true,
  })

  const entryPoints = entryFiles
    .filter((f) => f.isFile())
    .filter((f) => !['package.json', 'README.md'].includes(f.name))
    .map((f) => path.resolve(epRoot, f.name))

  const bundle = await rollup({
    ...config,
    input: entryPoints,
    external: () => true,
  })

  const rewriter = (id) => {
    if (id.startsWith(`${SN_PREFIX}/components`))
      return id.replace(`${SN_PREFIX}/components`, './components')
    else if (id.startsWith(SN_PREFIX) && excludes.every((e) => !id.endsWith(e)))
      return id.replace(SN_PREFIX, '.')
    else return ''
  }

  yellow('Generating entries')
  writeBundles(
    bundle,
    Object.values(buildConfig).map((config) => ({
      format: config.format,
      dir: config.output.path,
      exports: config.format === 'cjs' ? 'named' : undefined,
      paths: rewriter,
    }))
  )
  green('entries generated')
}

export const copyFullStyle = () =>
  Promise.all([
    run(`cp ${epOutput}/theme-chalk/index.css ${epOutput}/dist/index.css`),
  ])

export const buildFullBundle = series(init, parallel(buildFull, buildEntry))

import path from 'path'
import fs from 'fs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import replace from '@rollup/plugin-replace'
import { parallel } from 'gulp'

import { RollupResolveEntryPlugin } from './rollup-plugin-entry'
import { epRoot, epOutput } from './utils/paths'
import { SN_PREFIX, excludes } from './constants'
import { yellow, green } from './utils/log'
import { run } from './utils/process'
import { generateExternal, writeBundles } from './utils/rollup'
import { withTaskName } from './utils/gulp'
import { buildConfig } from './info'

const getConfig = async (opt = {}) => ({
  input: path.resolve(epRoot, 'index.js'),
  plugins: [
    nodeResolve(),
    vue({
      target: 'browser',
      // css: false,
      exposeFilename: false,
    }),
    commonjs(),
    esbuild({
      minify: opt.minify,
      sourceMap: opt.sourceMap,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    ...(opt.plugins ?? []),
  ],
  external: await generateExternal({ full: true }),
})

export const buildFull = (minify) => async () => {
  const bundle = await rollup(
    await getConfig({
      plugins: [RollupResolveEntryPlugin()],
      minify,
      sourceMap: minify,
    })
  )
  await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(epOutput, `dist/index.full${minify ? '.min' : ''}.js`),
      exports: 'named',
      name: 'SpiderNestVue',
      globals: {
        vue: 'Vue',
      },
      sourcemap: minify,
    },
    {
      format: 'esm',
      file: path.resolve(
        epOutput,
        `dist/index.full${minify ? '.min' : ''}.mjs`
      ),
      sourcemap: minify,
    },
  ])
}

export const buildEntry = async () => {
  const entryFiles = await fs.promises.readdir(epRoot, {
    withFileTypes: true,
  })

  const entryPoints = entryFiles
    .filter((f) => f.isFile())
    .filter((f) => !['package.json', 'README.md'].includes(f.name))
    .map((f) => path.resolve(epRoot, f.name))

  const bundle = await rollup({
    ...(await getConfig()),
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

export const buildFullBundle = parallel(
  withTaskName('buildFullMinified', buildFull(true)),
  withTaskName('buildFull', buildFull(false)),
  buildEntry
)

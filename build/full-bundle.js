const path = require('path')
const fs = require('fs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const { rollup } = require('rollup')
const commonjs = require('@rollup/plugin-commonjs')
const vue = require('rollup-plugin-vue')
const esbuild = require('rollup-plugin-esbuild')
const replace = require('@rollup/plugin-replace')
const { parallel } = require('gulp')

const { RollupResolveEntryPlugin } = require('./rollup-plugin-entry')
const { snRoot, snOutput } = require('./utils/paths')
const { yellow, green } = require('./utils/log')
const { run } = require('./utils/process')
const {
  generateExternal,
  rollupPathRewriter,
  writeBundles,
} = require('./utils/rollup')
const { withTaskName } = require('./utils/gulp')
const { buildConfig } = require('./info')

const getConfig = async (opt = {}) => ({
  input: path.resolve(snRoot, 'index.js'),
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

const buildFull = (minify) => async () => {
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
      file: path.resolve(snOutput, `dist/index.full${minify ? '.min' : ''}.js`),
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
        snOutput,
        `dist/index.full${minify ? '.min' : ''}.mjs`
      ),
      sourcemap: minify,
    },
  ])
}

const buildEntry = async () => {
  const entryFiles = await fs.promises.readdir(snRoot, {
    withFileTypes: true,
  })

  const entryPoints = entryFiles
    .filter((f) => f.isFile())
    .filter((f) => !['package.json', 'README.md'].includes(f.name))
    .map((f) => path.resolve(snRoot, f.name))

  const bundle = await rollup({
    ...(await getConfig()),
    input: entryPoints,
    external: () => true,
  })

  yellow('Generating entries')
  const rewriter = await rollupPathRewriter()
  writeBundles(
    bundle,
    Object.entries(buildConfig).map(([module, config]) => ({
      format: config.format,
      dir: config.output.path,
      exports: config.format === 'cjs' ? 'named' : undefined,
      paths: rewriter(module),
    }))
  )
  green('entries generated')
}

const copyFullStyle = () =>
  Promise.all([
    run(`cp ${snOutput}/theme-chalk/index.css ${snOutput}/dist/index.css`),
  ])

const buildFullBundle = parallel(
  withTaskName('buildFullMinified', buildFull(true)),
  withTaskName('buildFull', buildFull(false)),
  buildEntry
)

module.exports = {
  buildFull,
  buildEntry,
  copyFullStyle,
  buildFullBundle,
}

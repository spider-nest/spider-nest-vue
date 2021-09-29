const fs = require('fs')
const path = require('path')
const { series, parallel } = require('gulp')
const { rollup } = require('rollup')
const vue = require('rollup-plugin-vue')
const css = require('rollup-plugin-css-only')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const esbuild = require('rollup-plugin-esbuild')
const { sync: globSync } = require('fast-glob')
const filesize = require('rollup-plugin-filesize')

const { compRoot } = require('./utils/paths')
const {
  generateExternal,
  rollupPathRewriter,
  writeBundles,
} = require('./utils/rollup')
const { buildConfig } = require('./info')
const reporter = require('./size-reporter')

const plugins = [
  css(),
  vue({
    target: 'browser',
    // css: false,
  }),
  nodeResolve(),
  commonjs(),
  esbuild(),
]

async function getComponents() {
  const files = globSync('*', {
    cwd: compRoot,
    onlyDirectories: true,
  })
  return files.map((file) => ({
    path: path.resolve(compRoot, file),
    name: file,
  }))
}

async function buildEachComponent() {
  const componentPaths = await getComponents()
  const external = await generateExternal({ full: false })
  const pathRewriter = await rollupPathRewriter()

  const builds = componentPaths.map(
    async ({ path: p, name: componentName }) => {
      const entry = path.resolve(p, 'index.js')
      if (!fs.existsSync(entry)) return

      const rollupConfig = {
        input: entry,
        plugins,
        external,
      }
      const opts = Object.entries(buildConfig).map(([module, config]) => ({
        format: config.format,
        file: path.resolve(
          config.output.path,
          'components',
          componentName,
          'index.js'
        ),
        exports: module === 'cjs' ? 'named' : undefined,
        paths: pathRewriter(module),
        plugins: [filesize({ reporter })],
      }))

      const bundle = await rollup(rollupConfig)
      await writeBundles(bundle, opts)
    }
  )
  await Promise.all(builds)
}

async function buildComponentEntry() {
  const entry = path.resolve(compRoot, 'index.js')
  const config = {
    input: entry,
    plugins,
    external: () => true,
  }
  const opts = Object.values(buildConfig).map((config) => ({
    format: config.format,
    file: path.resolve(config.output.path, 'components/index.js'),
    plugins: [filesize({ reporter })],
  }))

  const bundle = await rollup(config)
  await writeBundles(bundle, opts)
}

const buildComponent = series(parallel(buildEachComponent, buildComponentEntry))

module.exports = {
  buildEachComponent,
  buildComponentEntry,
  buildComponent,
}

import fs from 'fs'
import path from 'path'
import { series, parallel } from 'gulp'
import { rollup } from 'rollup'
import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import { sync as globSync } from 'fast-glob'
import filesize from 'rollup-plugin-filesize'

import { compRoot } from './utils/paths'
import { generateExternal, writeBundles } from './utils/rollup'
import { getWorkspaceNames } from './utils/pkg'

import { buildConfig } from './info'
import reporter from './size-reporter'
import { SN_PREFIX } from './constants'

let workspacePkgs = []
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

const pathsRewriter = (module) => (id) => {
  const config = buildConfig[module]
  if (workspacePkgs.some((pkg) => id.startsWith(pkg)))
    return id.replace(SN_PREFIX, config.bundle.path)
  else return ''
}

const init = async () => {
  workspacePkgs = (await getWorkspaceNames()).filter((pkg) =>
    pkg.startsWith(SN_PREFIX)
  )
}

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
        paths: pathsRewriter(module),
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

export const buildComponents = series(
  init,
  parallel(buildEachComponent, buildComponentEntry)
)
export { buildEachComponent, buildComponentEntry }

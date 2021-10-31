import chalk from 'chalk'
import ora from 'ora'
import fb from 'fast-glob'
import { rollup } from 'rollup'
import css from 'rollup-plugin-css-only'
import vue from 'rollup-plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import filesize from 'rollup-plugin-filesize'

import { resolveFalse, resolveTrue } from '../utils/promiseResolve.mjs'
import excludeFiles from '../utils/excludeFiles.mjs'
import { pkgRoot, snRoot } from '../utils/paths.mjs'
import { getExternal, writeBundles } from '../utils/rollup.mjs'
import buildConfigEntries from '../utils/output.mjs'

import spiderNestVueAlias from '../plugins/alias.mjs'
import reporter from '../plugins/reporter.mjs'

const spinner = ora()

const getInputs = async () => {
  return excludeFiles(
    await fb('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
}

const getBundles = async (input) => {
  return await rollup({
    input,
    plugins: [
      await spiderNestVueAlias(),
      css(),
      vue({ target: 'browser' }),
      nodeResolve({
        extensions: ['.js', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: true,
        target: 'esnext',
      }),
      filesize({ reporter }),
    ],
    external: await getExternal({ full: false }),
    treeshake: false,
  })
}

const writeBundle = async (bundle) => {
  return await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]) => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: snRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}

const main = async () => {
  const input = await getInputs()
  if (!input?.length) return resolveFalse

  const bundles = await getBundles(input)
  if (!bundles) return resolveFalse

  const wrote = await writeBundle(bundles)
  if (!wrote) return resolveFalse

  return resolveTrue
}

export default function buildModulesTask() {
  return new Promise((resolve) => {
    spinner.start(chalk.blue('Modules Building...'))
    main().then((flag) => {
      if (!flag) return resolve(false)
      spinner.succeed(chalk.green('Build Modules OK!'))
      resolve(true)
    })
  })
}

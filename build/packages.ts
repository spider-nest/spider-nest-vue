import path from 'path'
import ts from 'gulp-typescript'
import { src, dest, series, parallel } from 'gulp'

import { withTaskName, gulpPathRewriter } from './utils/gulp'
import { snOutput, projRoot } from './utils/paths'
import { getPackageManifest } from './utils/pkg'

import { buildConfig } from './info'

import { SN_PREFIX } from './constants'

import type { BuildConfigEntries } from './info'

export const buildPackage = (pkgPath: string) => {
  const manifest = getPackageManifest(path.resolve(pkgPath, 'package.json'))
  const pkgName = manifest.name!.replace(`${SN_PREFIX}/`, '')

  const tasks = (Object.entries(buildConfig) as BuildConfigEntries).map(
    ([module, config]) => {
      const output = path.resolve(pkgPath, 'dist', config.output.name)

      const build = () => {
        const tsConfig = path.resolve(projRoot, 'tsconfig.json')
        const inputs = [
          '**/*.ts',
          '!node_modules',
          '!gulpfile.ts',
          '!__test?(s)__/*',
          path.resolve(projRoot, 'typings', '*.d.ts'),
        ]
        return withTaskName(`build:${pkgName}:${module}`, () =>
          src(inputs)
            .pipe(
              ts.createProject(tsConfig, {
                module: config.module,
                strict: false,
              })()
            )
            .pipe(gulpPathRewriter(module))
            .pipe(dest(output))
        )
      }

      const copy = () =>
        withTaskName(`copy:${pkgName}:${module}`, () =>
          src(`${output}/**`).pipe(
            dest(path.resolve(snOutput, config.output.name, pkgName))
          )
        )

      return series(build(), copy())
    }
  )

  return parallel(...tasks)
}

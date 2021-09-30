import path from 'path'

import { snOutput } from './utils/paths'

import type { ModuleFormat } from 'rollup'

export const modules = ['esm', 'cjs'] as const

export type Module = typeof modules[number]

export interface BuildInfo {
  module: 'ESNext' | 'CommonJS'
  format: ModuleFormat
  output: {
    name: string
    path: string
  }

  bundle: {
    path: string
  }
}

export const buildConfig: Record<Module, BuildInfo> = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    output: {
      name: 'es',
      path: path.resolve(snOutput, 'es'),
    },
    bundle: {
      path: 'spider-nest-vue/es',
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    output: {
      name: 'lib',
      path: path.resolve(snOutput, 'lib'),
    },
    bundle: {
      path: 'spider-nest-vue/lib',
    },
  },
}

export type BuildConfig = typeof buildConfig

export type BuildConfigEntries = [Module, BuildInfo][]

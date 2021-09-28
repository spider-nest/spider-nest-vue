import path from 'path'
import { epOutput } from './utils/paths'

export const modules = ['esm', 'cjs']

export const buildConfig = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    output: {
      name: 'es',
      path: path.resolve(epOutput, 'es'),
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
      path: path.resolve(epOutput, 'lib'),
    },
    bundle: {
      path: 'spider-nest-vue/lib',
    },
  },
}

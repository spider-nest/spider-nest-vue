import { resolve } from 'path'

import { SN_PKG } from './constants.mjs'
import { snOutput } from './paths.mjs'

export const buildConfig = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: resolve(snOutput, 'es'),
    },
    bundle: {
      path: `${SN_PKG}/es`,
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      name: 'lib',
      path: resolve(snOutput, 'lib'),
    },
    bundle: {
      path: `${SN_PKG}/lib`,
    },
  },
}

const buildConfigEntries = Object.entries(buildConfig)

export default buildConfigEntries

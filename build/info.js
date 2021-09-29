const path = require('path')

const { snOutput } = require('./utils/paths')

const modules = ['esm', 'cjs']

const buildConfig = {
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

module.exports = {
  modules,
  buildConfig,
}

const fs = require('fs')
const path = require('path')

const pkg = require('../packages/spider-nest-vue/package.json')

const tagVer = process.env.TAG_VERSION

let version = ''

if (tagVer) {
  version = tagVer.startsWith('v') ? tagVer.slice(1) : tagVer
} else {
  version = pkg.version
}

fs.writeFileSync(
  path.resolve(__dirname, '../packages/spider-nest-vue/version.js'),
  `export const version = '${version}'
`
)

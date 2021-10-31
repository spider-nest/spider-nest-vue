const path = require('path')
const fs = require('fs-extra')

const pkg = require('../packages/spider-nest-vue/package.json')

let version = pkg.version
const tagVersion = process.env.TAG_VERSION
if (tagVersion) {
  version = tagVersion.startsWith('v') ? tagVersion.slice(1) : tagVersion
}

;['ts', 'mjs'].forEach((ext) => {
  fs.writeFileSync(
    path.resolve(__dirname, `../packages/spider-nest-vue/version.${ext}`),
    `export const version = '${version}'
`
  )
})

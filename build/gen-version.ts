import path from 'path'
import fs from 'fs-extra'

import pkg from '../packages/spider-nest-vue/package.json' // need to be checked

const tagVer = process.env.TAG_VERSION

let version = ''

if (tagVer) {
  version = tagVer.startsWith('v') ? tagVer.slice(1) : tagVer
} else {
  version = pkg.version
}

fs.writeFileSync(
  path.resolve(__dirname, '../packages/spider-nest-vue/version.ts'),
  `export const version = '${version}'
`
)

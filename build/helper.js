const path = require('path')
const helper = require('components-helper')

const { snPackage, snOutput, projRoot } = require('./utils/paths')
const { getPackageManifest } = require('./utils/pkg')

const reComponentName = (title) =>
  `sn-${title
    .replace(/\B([A-Z])/g, '-$1')
    .replace(/[ ]+/g, '-')
    .toLowerCase()}`

const reDocUrl = (fileName, header) => {
  const docs = 'https://blog.cnguu.cn/'
  const _header = header
    ? header.replace(/[ ]+/g, '-').toLowerCase()
    : undefined
  return docs + fileName + (_header ? `#${_header}` : '')
}

const reAttribute = (value, key) => {
  const _value = value.match(/^\*\*(.*)\*\*$/)
  const str = _value ? _value[1] : value

  if (key === 'Name' && /^(-|—)$/.test(str)) {
    return 'default'
  } else if (str === '' || /^(-|—)$/.test(str)) {
    return undefined
  } else if (key === 'Attribute' && /v-model:(.+)/.test(str)) {
    const _str = str.match(/v-model:(.+)/)
    return _str ? _str[1] : undefined
  } else if (key === 'Attribute' && /v-model/.test(str)) {
    return 'model-value'
  } else if (key === 'Attribute') {
    return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
  } else if (key === 'Type') {
    return str
      .replace(/\s*\/\s*/g, '|')
      .replace(/\s*,\s*/g, '|')
      .replace(/\(.*\)/g, '')
      .toLowerCase()
  } else if (key === 'Accepted Values') {
    return /\[.+\]\(.+\)/.test(str) || /^\*$/.test(str)
      ? undefined
      : str.replace(/`/g, '')
  } else {
    return str
  }
}

const buildHelper = (done) => {
  const { name, version } = getPackageManifest(snPackage)

  const tagVer = process.env.TAG_VERSION
  const _version = tagVer
    ? tagVer.startsWith('v')
      ? tagVer.slice(1)
      : tagVer
    : version

  helper({
    name: name,
    version: _version,
    entry: `${path.resolve(
      projRoot,
      'docs/en-US/component'
    )}/!(datetime-picker|message-box|message).md`,
    outDir: snOutput,
    reComponentName,
    reDocUrl,
    reAttribute,
    props: 'Attributes',
    propsName: 'Attribute',
    propsOptions: 'Accepted Values',
    eventsName: 'Event Name',
    tableRegExp:
      '#+\\s+(.*\\s*Attributes|.*\\s*Events|.*\\s*Slots|.*\\s*Directives)\\s*\\n+(\\|?.+\\|.+)\\n\\|?\\s*:?-+:?\\s*\\|.+((\\n\\|?.+\\|.+)+)',
  })

  done()
}

module.exports = { buildHelper }

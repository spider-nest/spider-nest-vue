const path = require('path')

function RollupResolveEntryPlugin() {
  return {
    name: 'spider-nest-vue-entry-plugin',
    transform(code, id) {
      if (id.includes('packages')) {
        return {
          code: code.replace(
            /@spider-nest-vue\/(components|directives|utils|hooks|tokens|locale)/g,
            `${path.relative(
              path.dirname(id),
              path.resolve(__dirname, '../packages')
            )}/$1`
          ),
          map: null,
        }
      }
      return { code, map: null }
    },
  }
}

module.exports = { RollupResolveEntryPlugin }

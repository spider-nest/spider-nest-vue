import { getPackages } from '../utils/packages.mjs'
import { SN_PKG, SN_PREFIX } from '../utils/constants.mjs'

export default async function spiderNestVueAlias() {
  const packages = await getPackages()
  const palette = `${SN_PREFIX}/palette`
  return {
    name: 'spider-nest-vue-alias-plugin',
    resolveId(source, importer, options) {
      if (!source.startsWith(SN_PREFIX)) return
      if (source.startsWith(palette)) {
        return {
          id: source.replaceAll(palette, `${SN_PKG}/palette`),
          external: 'absolute',
        }
      }
      let updatedSource = source
      for (const pkg of packages) {
        if (source.startsWith(pkg.name)) {
          updatedSource = updatedSource.replace(pkg.name, pkg.dir)
        }
      }
      return this.resolve(source, importer, { skipSelf: true, ...options })
    },
  }
}

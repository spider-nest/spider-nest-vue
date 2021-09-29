const { SN_PREFIX } = require('../constants')
const { snPackage } = require('./paths')
const {
  getWorkspacePackages,
  getPackageDependencies,
  getWorkspaceNames,
  pathRewriter,
} = require('./pkg')

const generateExternal = async (options) => {
  const monoPackages = (await getWorkspacePackages())
    .map((pkg) => pkg.manifest.name)
    .filter((name) => !!name)

  return (id) => {
    const packages = ['vue']
    if (!options.full) {
      const depPackages = getPackageDependencies(snPackage)
      packages.push('@vue', ...monoPackages, ...depPackages)
    }

    return [...new Set(packages)].some(
      (pkg) => id === pkg || id.startsWith(`${pkg}/`)
    )
  }
}

function writeBundles(bundle, options) {
  return Promise.all(options.map((option) => bundle.write(option)))
}

const rollupPathRewriter = async () => {
  const workspacePkgs = (await getWorkspaceNames()).filter((pkg) =>
    pkg.startsWith(SN_PREFIX)
  )

  return (module) => {
    const rewriter = pathRewriter(module, false)

    return (id) => {
      if (workspacePkgs.some((pkg) => id.startsWith(pkg))) {
        return rewriter(id)
      } else {
        return ''
      }
    }
  }
}

module.exports = {
  generateExternal,
  writeBundles,
  rollupPathRewriter,
}

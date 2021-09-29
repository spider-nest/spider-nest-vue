const findWorkspacePackages = require('@pnpm/find-workspace-packages')

const { buildConfig } = require('../info')
const { SN_PREFIX } = require('../constants')
const { projRoot } = require('./paths')

const getWorkspacePackages = () => findWorkspacePackages(projRoot)

const getWorkspaceNames = async () => {
  const pkgs = await findWorkspacePackages(projRoot)
  return pkgs.map((pkg) => pkg.manifest.name).filter((name) => !!name)
}

const getWorkspacePackageManifest = async (name) => {
  const packages = await getWorkspacePackages()
  const { manifest } = packages.find((pkg) => pkg.manifest.name === name)
  return manifest
}

const getPackageManifest = (pkgPath) => {
  return require(pkgPath)
}

const getPackageDependencies = (pkgPath) => {
  const manifest = getPackageManifest(pkgPath)
  const { dependencies } = manifest
  return Object.keys(dependencies ?? {})
}

const pathRewriter = (module, replaceAll) => {
  const replaceName = replaceAll ? 'replaceAll' : 'replace'
  const config = buildConfig[module]

  return (id) => {
    id = id[replaceName](
      `${SN_PREFIX}/theme-chalk`,
      'spider-nest-vue/theme-chalk'
    )
    id = id[replaceName](`${SN_PREFIX}/`, `${config.bundle.path}/`)
    return id
  }
}

module.exports = {
  getWorkspacePackages,
  getWorkspaceNames,
  getWorkspacePackageManifest,
  getPackageManifest,
  getPackageDependencies,
  pathRewriter,
}

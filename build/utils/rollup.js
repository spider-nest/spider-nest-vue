import { epPackage } from './paths'
import { getWorkspacePackages, getPackageDependencies } from './pkg'

export const generateExternal = async (options) => {
  const monoPackages = (await getWorkspacePackages())
    .map((pkg) => pkg.manifest.name)
    .filter((name) => !!name)

  return (id) => {
    const packages = ['vue']
    if (!options.full) {
      const depPackages = getPackageDependencies(epPackage)
      packages.push('@vue', ...monoPackages, ...depPackages)
    }

    return [...new Set(packages)].some(
      (pkg) => id === pkg || id.startsWith(`${pkg}/`)
    )
  }
}

export function writeBundles(bundle, options) {
  return Promise.all(options.map((option) => bundle.write(option)))
}

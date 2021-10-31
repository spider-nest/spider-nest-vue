import { SN_PKG } from './constants.mjs'
import { snPackage } from './paths.mjs'
import { getPackageDependencies } from './packages.mjs'

export const getExternal = async (options) => {
  const packages = ['vue']
  if (!options?.full) {
    packages.push(`${SN_PKG}/palette`)
    packages.push('@vue', ...getPackageDependencies(snPackage))
  }
  return (source) => {
    return [...new Set(packages)].some(
      (pkg) => source === pkg || source.startsWith(`${pkg}/`)
    )
  }
}

export function writeBundles(bundle, options) {
  return Promise.all(options.map((option) => bundle.write(option)))
}

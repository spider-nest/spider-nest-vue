import { createRequire } from 'module'
import findWorkspacePackages from '@pnpm/find-workspace-packages'

import { pkgRoot, appRoot } from './paths.mjs'
import { SN_PKG, SN_PREFIX } from './constants.mjs'
import { buildConfig } from "./output.mjs";

const require = createRequire(import.meta.url)

const getWorkspacePackages = () => {
  return findWorkspacePackages.default(appRoot)
}

export const getPackages = async () => {
  const packages = await getWorkspacePackages()
  return packages
    .map((pkg) => ({ name: pkg.manifest.name, dir: pkg.dir }))
    .filter(
      (pkg) =>
        !!pkg.name &&
        !!pkg.dir &&
        pkg.name.startsWith(SN_PREFIX) &&
        pkg.dir.startsWith(pkgRoot) &&
        pkg.name !== `${SN_PREFIX}/palette`
    )
}

const getPackageManifest = (path) => {
  return require(path)
}

export const getPackageDependencies = (path) => {
  const manifest = getPackageManifest(path)
  const { dependencies } = manifest
  return Object.keys(dependencies ?? {})
}

export const pathRewriter = (module) => {
  const config = buildConfig[module]
  return (id) => {
    id = id.replaceAll(`${SN_PREFIX}/palette`, `${SN_PKG}/palette`)
    id = id.replaceAll(`${SN_PREFIX}/`, `${config.bundle.path}/`)
    return id
  }
}

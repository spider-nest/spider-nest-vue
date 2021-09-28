import findWorkspacePackages from '@pnpm/find-workspace-packages'
import { projRoot } from './paths'

export const getWorkspacePackages = () => findWorkspacePackages(projRoot)

export const getWorkspaceNames = async () => {
  const pkgs = await findWorkspacePackages(projRoot)
  return pkgs.map((pkg) => pkg.manifest.name).filter((name) => !!name)
}

export const getWorkspacePackageManifest = async (name) => {
  const packages = await getWorkspacePackages()
  const { manifest } = packages.find((pkg) => pkg.manifest.name === name)
  return manifest
}

export const getPackageManifest = (pkgPath) => {
  return require(pkgPath)
}

export const getPackageDependencies = (pkgPath) => {
  const manifest = getPackageManifest(pkgPath)
  const { dependencies } = manifest
  return Object.keys(dependencies ?? {})
}

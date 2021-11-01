import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

import { SN_PKG } from './constants.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const appRoot = resolve(__dirname, '..', '..')
export const pkgRoot = resolve(appRoot, 'packages')
export const snRoot = resolve(pkgRoot, SN_PKG)
export const paletteRoot = resolve(pkgRoot, 'palette')

export const buildOutput = resolve(appRoot, 'dist')
export const snOutput = resolve(buildOutput, SN_PKG)
export const distOutput = resolve(snOutput, 'dist')
export const paletteOutput = resolve(snOutput, 'palette')

export const snPackage = resolve(snRoot, 'package.json')

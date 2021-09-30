import installer from './defaults'
export * from '@spider-nest-vue/components'
export * from '@spider-nest-vue/directives'
export * from '@spider-nest-vue/hooks'
export * from '@spider-nest-vue/tokens'

export { default as makeInstaller } from './make-installer'
export { default } from './defaults'

export const install = installer.install
export const version = installer.version

import { isObject, isArray, isString } from '@vue/shared'

export { isObject, isArray, isString }

export const isServer = typeof window === 'undefined'

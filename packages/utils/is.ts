import {
  isArray as vIsArray,
  isSet as vIsSet,
  isMap as vIsMap,
  isDate as vIsDate,
  isFunction as vIsFunction,
  isString as vIsString,
  isSymbol as vIsSymbol,
  isPlainObject as vIsObject,
  isPromise as vIsPromise,
} from '@vue/shared'

const objectToString = Object.prototype.toString
const toTypeString = (value: unknown): string => objectToString.call(value)

export function is(val: unknown, type: string): boolean {
  return toTypeString(val) === `[object ${type}]`
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export const isArray = vIsArray

export const isMap = (val: unknown): boolean => vIsMap(val)

export const isSet = (val: unknown): boolean => vIsSet(val)

export const isDate = (val: unknown): boolean => vIsDate(val)

export const isFunction = (val: unknown): boolean => vIsFunction(val)

export const isString = (val: unknown): boolean => vIsString(val)

export const isSymbol = (val: unknown): boolean => vIsSymbol(val)

export const isObject = (val: unknown): boolean => vIsObject(val)

export const isPromise = (val: unknown): boolean => vIsPromise(val)

export const isDefined = (val: unknown): boolean => {
  return val !== undefined && val !== null
}

export const isUndefined = (val: unknown): boolean => {
  return !isDefined(val)
}

export function isEmpty(val: any): boolean {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (isMap(val) || isSet(val)) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

export function isNumber(val: unknown): boolean {
  return is(val, 'Number')
}

export function isBoolean(val: unknown): boolean {
  return is(val, 'Boolean')
}

export function isRegExp(val: unknown): boolean {
  return is(val, 'RegExp')
}

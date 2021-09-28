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
const toTypeString = (value) => objectToString.call(value)

export const isServer = typeof window === 'undefined'

export const isArray = vIsArray

export const isMap = (val) => vIsMap(val)

export const isSet = (val) => vIsSet(val)

export const isDate = (val) => vIsDate(val)

export const isFunction = (val) => vIsFunction(val)

export const isString = (val) => vIsString(val)

export const isSymbol = (val) => vIsSymbol(val)

export const isObject = (val) => vIsObject(val)

export const isPromise = (val) => vIsPromise(val)

export const is = (val, type) => {
  return toTypeString(val) === `[object ${type}]`
}

export const isDefined = (val) => {
  return val !== undefined && val !== null
}

export const isUndefined = (val) => {
  return !isDefined(val)
}

export function isEmpty(val) {
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

export function isNumber(val) {
  return is(val, 'Number')
}

export function isBoolean(val) {
  return is(val, 'Boolean')
}

export function isRegExp(val) {
  return is(val, 'RegExp')
}

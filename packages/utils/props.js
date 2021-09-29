import mapValues from 'lodash/mapValues'

import { debugWarn } from './error'

const wrapperKey = Symbol()

export function buildProp(option = {}) {
  const { values, required, default: defaultValue, type, validator } = option
  const _validator =
    values || validator
      ? (val) => {
          let valid = false
          let allowedValues = []

          if (values) {
            allowedValues = [...values, defaultValue]
            valid || (valid = allowedValues.includes(val))
          }
          if (validator) valid || (valid = validator(val))

          if (!valid && allowedValues.length > 0) {
            debugWarn(
              `Vue warn`,
              `Invalid prop: Expected one of (${allowedValues.join(
                ', '
              )}), got value ${val}`
            )
          }
          return valid
        }
      : undefined

  return {
    type: type?.[wrapperKey] || type,
    required: !!required,
    default: defaultValue,
    validator: _validator,
  }
}

export const buildProps = (options) =>
  mapValues(options, (option) => buildProp(option))

export const definePropType = (val) => ({ [wrapperKey]: val })

export const keyOf = (arr) => Object.keys(arr)
export const mutable = (val) => val

export const componentSize = ['large', 'medium', 'small', 'mini']

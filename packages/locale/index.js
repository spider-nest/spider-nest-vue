import dayjs from 'dayjs'

import defaultLang from './lang/en'

let lang = defaultLang

let i18nHandler = null

export const i18n = (fn) => {
  i18nHandler = fn
}

export const restoreHandler = () => (i18nHandler = defaultTranslator)

function template(str, option) {
  if (!str || !option) return str

  return str.replace(/\{(\w+)\}/g, (_, key) => {
    return option[key]
  })
}

const defaultTranslator = (...args) => {
  const [path, option] = args
  let value
  const array = path.split('.')
  let current = lang
  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i]
    value = current[property]
    if (i === j - 1) return template(value, option)
    if (!value) return ''
    current = value
  }
}

export const t = (...args) => {
  if (i18nHandler) {
    const translation = i18nHandler(...args)
    return translation || defaultTranslator(...args)
  }
  return defaultTranslator(...args)
}

export const use = (l) => {
  lang = l || lang
  if (lang.name) {
    dayjs.locale(lang.name)
  }
}

export const setLocale = use

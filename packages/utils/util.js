import { camelize, capitalize, extend, hasOwn, looseEqual } from '@vue/shared'

export { hasOwn, capitalize, camelize, looseEqual, extend }

export function rafThrottle(fn) {
  let locked = false
  return function (...args) {
    if (locked) return
    locked = true
    window.requestAnimationFrame(() => {
      fn.apply(this, args)
      locked = false
    })
  }
}

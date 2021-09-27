import { watch } from 'vue'

import { on, off } from '@spider-nest-vue/utils/dom'

export default (el, events) => {
  watch(el, (val) => {
    if (val) {
      events.forEach(({ name, handler }) => {
        on(el.value, name, handler)
      })
    } else {
      events.forEach(({ name, handler }) => {
        off(el.value, name, handler)
      })
    }
  })
}

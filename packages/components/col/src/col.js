import { defineComponent, computed, inject, h } from 'vue'

import { isNumber, isObject } from '@spider-nest-vue/utils/is'

const SnCol = defineComponent({
  name: 'SnCol',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    span: {
      type: Number,
      default: 24,
    },
    offset: {
      type: Number,
      default: 0,
    },
    pull: {
      type: Number,
      default: 0,
    },
    push: {
      type: Number,
      default: 0,
    },
    xs: {
      type: [Number, Object],
      default: () => ({}),
    },
    sm: {
      type: [Number, Object],
      default: () => ({}),
    },
    md: {
      type: [Number, Object],
      default: () => ({}),
    },
    lg: {
      type: [Number, Object],
      default: () => ({}),
    },
    xl: {
      type: [Number, Object],
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const { gutter } = inject('SnRow', { gutter: { value: 0 } })

    const style = computed(() => {
      if (gutter.value) {
        return {
          paddingLeft: `${gutter.value / 2}px`,
          paddingRight: `${gutter.value / 2}px`,
        }
      }
      return {}
    })
    const classList = computed(() => {
      const ret = []
      const pos = ['span', 'offset', 'pull', 'push']
      pos.forEach((prop) => {
        const size = props[prop]
        if (isNumber(size)) {
          if (prop === 'span') ret.push(`sn-col-${props[prop]}`)
          else if (size > 0) ret.push(`sn-col-${prop}-${props[prop]}`)
        }
      })

      const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
      sizes.forEach((size) => {
        const sizeProps = props[size]
        if (isNumber(sizeProps)) {
          ret.push(`sn-col-${size}-${sizeProps}`)
        } else if (isObject(sizeProps)) {
          Object.keys(sizeProps).forEach((prop) => {
            ret.push(
              prop !== 'span'
                ? `sn-col-${size}-${prop}-${sizeProps[prop]}`
                : `sn-col-${size}-${sizeProps[prop]}`
            )
          })
        }
      })

      if (gutter.value) {
        ret.push('is-guttered')
      }

      return ret
    })

    return () =>
      h(
        props.tag,
        {
          class: ['sn-col', classList.value],
          style: style.value,
        },
        slots.default?.()
      )
  },
})

export default SnCol

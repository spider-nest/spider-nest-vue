import { defineComponent, computed, inject, h } from 'vue'

import { isNumber, isObject } from '@spider-nest-vue/utils/is'

import type { PropType } from 'vue'

type SizeObject = {
  span: number
  offset: number
}

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
      type: [Number, Object] as PropType<number | SizeObject>,
      default: () => ({} as SizeObject),
    },
    sm: {
      type: [Number, Object] as PropType<number | SizeObject>,
      default: () => ({} as SizeObject),
    },
    md: {
      type: [Number, Object] as PropType<number | SizeObject>,
      default: () => ({} as SizeObject),
    },
    lg: {
      type: [Number, Object] as PropType<number | SizeObject>,
      default: () => ({} as SizeObject),
    },
    xl: {
      type: [Number, Object] as PropType<number | SizeObject>,
      default: () => ({} as SizeObject),
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
      const ret: string[] = []
      const pos = ['span', 'offset', 'pull', 'push'] as const
      pos.forEach((prop) => {
        const size = props[prop]
        if (isNumber(size)) {
          if (prop === 'span') ret.push(`sn-col-${props[prop]}`)
          else if (size > 0) ret.push(`sn-col-${prop}-${props[prop]}`)
        }
      })

      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
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

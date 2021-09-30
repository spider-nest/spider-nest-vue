import type { InjectionKey, ComputedRef } from 'vue'

export interface SnPaginationContext {
  currentPage?: ComputedRef<number>
  pageCount?: ComputedRef<number>
  disabled?: ComputedRef<boolean>
  changeEvent?: (val: number) => void
  handleSizeChange?: (val: number) => void
}

export const snPaginationKey: InjectionKey<SnPaginationContext> =
  Symbol('snPaginationKey')

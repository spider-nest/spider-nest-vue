declare module 'vue' {
  export interface GlobalComponents {
    SnCol: typeof import('spider-nest-vue')['SnCol']
    SnRow: typeof import('spider-nest-vue')['SnRow']
  }
}

export {}

class SpiderNestVueError extends Error {
  constructor(m: string) {
    super(m)
    this.name = 'SpiderNestVueError'
  }
}

export function throwError(scope: string, m: string): never {
  throw new SpiderNestVueError(`[${scope}] ${m}`)
}

export function debugWarn(scope, message) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(new SpiderNestVueError(`[${scope}] ${message}`))
  }
}

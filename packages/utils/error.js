class SpiderNestVueError extends Error {
  constructor(m) {
    super(m)
    this.name = 'SpiderNestVueError'
  }
}

export function throwError(scope, m) {
  throw new SpiderNestVueError(`[${scope}] ${m}`)
}

export function debugWarn(scope, message) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(new SpiderNestVueError(`[${scope}] ${message}`))
  }
}

export const withTaskName = (name, fn) =>
  Object.assign(fn, { displayName: name })

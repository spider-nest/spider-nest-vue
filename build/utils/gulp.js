const through2 = require('through2')

const { pathRewriter } = require('./pkg')

const withTaskName = (name, fn) => Object.assign(fn, { displayName: name })

const gulpPathRewriter = (module) => {
  const rewriter = pathRewriter(module, true)

  return through2.obj((file, _, cb) => {
    const contents = file.contents.toString()
    file.contents = Buffer.from(rewriter(contents))
    cb(null, file)
  })
}

module.exports = {
  withTaskName,
  gulpPathRewriter,
}

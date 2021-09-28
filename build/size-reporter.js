import { cyan, bold, yellow, green } from 'chalk'

const reporter = (opt, outputOptions, info) => {
  const values = [
    info.fileName ? [`${outputOptions.file?.split('packages/').pop()}`] : [],

    [`${info.bundleSize}`],
    ...(info.minSize ? [`${info.minSize}`] : []),
  ]

  return `${cyan(bold(values[0]))}: bundle size ${yellow(
    values[1]
  )} -> minified ${green(values[2])}`
}

export default reporter

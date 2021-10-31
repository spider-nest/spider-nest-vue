import chalk from 'chalk'
import ora from 'ora'

const { yellow, green, cyanBright } = chalk
const spinner = ora()

export default function reporter(fileSizeOptions, outputOptions, fileSizeInfo) {
  const text = `${cyanBright(fileSizeInfo.fileName)}: bundle size ${yellow(
    fileSizeInfo.bundleSize
  )} -> minified ${green(fileSizeInfo.minSize)}`
  spinner.info(text)
  return ''
}

const chalk = require('chalk')

function cyan(str) {
  console.log(chalk.cyan(str))
}

function yellow(str) {
  console.log(chalk.yellow(str))
}

function green(str) {
  console.log(chalk.green(str))
}

function red(str) {
  console.error(chalk.red(str))
}

function errorAndExit(e) {
  red(e.stack ?? e.message)
  process.exit(1)
}

module.exports = {
  cyan,
  yellow,
  green,
  red,
  errorAndExit,
}

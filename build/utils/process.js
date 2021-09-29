const { spawn } = require('child_process')

const { green } = require('./log')
const { projRoot } = require('./paths')

const run = async (command, cwd = projRoot) =>
  new Promise((resolve, reject) => {
    const args = command.split(' ')
    const cmd = /^win/.test(process.platform)
      ? `${args.shift()}.cmd`
      : args.shift()

    green(`run: ${cmd} ${args.join(' ')}`)
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)

      if (code === 0) resolve()
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        )
    })
    process.on('exit', onProcessExit)
  })

module.exports = { run }

import { spawn } from 'child_process'

import { green } from './log'

import { projRoot } from './paths'

const isWin = /^win/.test(process.platform)

export const run = async (command: string, cwd: string = projRoot) =>
  new Promise<void>((resolve, reject) => {
    const args = command.split(' ')
    const cmd = isWin ? `${args.shift()!}.cmd` : args.shift()!

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

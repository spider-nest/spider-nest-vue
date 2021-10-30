import { exec } from 'child_process'

export default function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        return reject(error)
      }
      resolve(stdout.trim())
    })
  })
}

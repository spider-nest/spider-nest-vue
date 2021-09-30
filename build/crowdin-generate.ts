import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'

import { docRoot } from './utils/paths'

// NB: this file is only for generating files that enables developers to develop the website.
const componentLocaleRoot = path.resolve(docRoot, '.vitepress/crowdin')

const exists = 'File already exists'

async function main() {
  const localeOutput = path.resolve(docRoot, '.vitepress/i18n')
  if (fs.existsSync(localeOutput)) {
    throw new Error(exists)
  }
  console.log(chalk.cyan('Starting for build doc for developing'))
  // all language should be identical since it is mirrored from crowdin.
  const dirs = await fs.promises.readdir(componentLocaleRoot, {
    withFileTypes: true,
  })
  const languages = dirs.map((dir) => dir.name)
  const langWithoutEn = languages.filter((l) => l !== 'en-US')

  await fs.promises.mkdir(localeOutput)

  // build lang.json for telling `header>language-select` how many languages are there
  await fs.promises.writeFile(
    path.resolve(localeOutput, 'lang.json'),
    JSON.stringify(languages),
    {
      encoding: 'utf-8',
    }
  )

  // loop through en-US

  const enUS = path.resolve(componentLocaleRoot, 'en-US')
  // we do not include en-US since we are currently using it as template
  const languagePaths = langWithoutEn.map((l) => {
    return {
      name: l,
      pathname: path.resolve(componentLocaleRoot, l),
    }
  })

  console.log(languagePaths)
  await traverseDir(enUS, languagePaths, localeOutput)
}

async function traverseDir(dir, paths, targetPath) {
  const contents = await fs.promises.readdir(dir, { withFileTypes: true })

  await Promise.all(
    contents.map(async (c) => {
      if (c.isDirectory()) {
        await fs.promises.mkdir(path.resolve(targetPath, c.name), {
          recursive: true,
        })

        return traverseDir(
          path.resolve(dir, c.name),
          paths.map((p) => {
            return {
              ...p,
              pathname: path.resolve(p.pathname, c.name),
            }
          }),
          path.resolve(targetPath, c.name)
        )
      } else if (c.isFile()) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const content = require(path.resolve(dir, c.name))

        const contentToWrite = {
          'en-US': content,
        }

        await Promise.all(
          paths.map(async (p) => {
            contentToWrite[p.name] = require(path.resolve(p.pathname, c.name))
          })
        )

        return fs.promises.writeFile(
          path.resolve(targetPath, c.name),
          JSON.stringify(contentToWrite, null, 2),
          {
            encoding: 'utf-8',
          }
        )
      }
    })
  )
}

main()
  .then(() => {
    console.log(chalk.green('Locale for website development generated'))
  })
  .catch((e) => {
    if (e.message === exists) {
      // do nothing
    } else {
      console.log(chalk.red(e.message))
      throw e
    }
  })

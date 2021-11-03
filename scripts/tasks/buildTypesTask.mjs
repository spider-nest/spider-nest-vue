import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'
import { Project } from 'ts-morph'
import fb from 'fast-glob'
import vueCompiler from '@vue/compiler-sfc'

import { appRoot, buildOutput, pkgRoot } from '../utils/paths.mjs'
import { SN_PKG, SN_PREFIX } from '../utils/constants.mjs'
import excludeFiles from '../utils/excludeFiles.mjs'
import { pathRewriter } from '../utils/packages.mjs'
import { resolveFalse, resolveTrue } from '../utils/promiseResolve.mjs'

const spinner = ora()

const outDir = path.resolve(buildOutput, 'types')
const tsConfigFilePath = path.resolve(appRoot, 'tsconfig.json')

const main = async () => {
  try {
    const project = new Project({
      compilerOptions: {
        allowJs: true,
        declaration: true,
        emitDeclarationOnly: true,
        noEmitOnError: false,
        outDir,
        baseUrl: appRoot,
        paths: {
          [`${SN_PREFIX}/*`]: ['packages/*'],
        },
        skipLibCheck: true,
      },
      tsConfigFilePath,
      skipAddingFilesFromTsConfig: true,
    })

    const filePaths = excludeFiles(
      await fb('**/*.{js,ts,vue}', {
        cwd: pkgRoot,
        absolute: true,
        onlyFiles: true,
      })
    )
    const sourceFiles = []
    await Promise.all(
      filePaths.map((filePath) => {
        if (filePath.endsWith('.vue')) {
          const content = fs.readFileSync(filePath, 'utf-8')
          const sfc = vueCompiler.parse(content)
          const { script, scriptSetup } = sfc.descriptor
          if (script || scriptSetup) {
            let content = ''
            let ifTS = false
            if (script && script.content) {
              content += script.content
              if (script.lang === 'ts') ifTS = true
            }
            if (scriptSetup) {
              const compiled = vueCompiler.compileScript(sfc.descriptor, {
                id: 'xxx',
              })
              content += compiled.content
              if (scriptSetup.lang === 'ts') ifTS = true
            }
            const sourceFile = project.createSourceFile(
              `${path.relative(process.cwd(), filePath)}${
                ifTS ? '.ts' : '.js'
              }`,
              content
            )
            sourceFiles.push(sourceFile)
          }
        } else if (filePath.endsWith('.ts')) {
          const sourceFile = project.addSourceFileAtPath(filePath)
          sourceFiles.push(sourceFile)
        }
      })
    )

    await project.emit({
      emitOnlyDtsFiles: true,
    })

    await Promise.all(
      sourceFiles.map(async (sourceFile) => {
        const relativePath = path.relative(pkgRoot, sourceFile.getFilePath())
        spinner.info(`Building Type File: ${chalk.yellow(relativePath)}`)

        const emitOutput = sourceFile.getEmitOutput()
        const emitFiles = emitOutput.getOutputFiles()
        if (emitFiles.length === 0) {
          spinner.info(`Emit No File: ${chalk.red(relativePath)}`)
          return
        }

        await Promise.all(
          emitFiles.map((outputFile) => {
            const filepath = outputFile.getFilePath()
            fs.mkdirSync(path.dirname(filepath), {
              recursive: true,
            })
            fs.writeFileSync(
              filepath,
              pathRewriter('esm')(outputFile.getText()),
              'utf8'
            )
            spinner.info(`Build Type File OK: ${chalk.green(relativePath)}`)
          })
        )
      })
    )

    const snOutDir = path.resolve(outDir, SN_PKG)
    fs.copySync(snOutDir, outDir)
    fs.removeSync(snOutDir)
    return resolveTrue
  } catch (error) {
    spinner.fail(chalk.red(error))
    return resolveFalse
  }
}

export default function buildTypesTask() {
  return new Promise((resolve) => {
    spinner.start(chalk.blue('Type Files Building...'))
    main().then((flag) => {
      if (!flag) return resolve(false)
      spinner.succeed(chalk.green('Build Type Files OK!'))
      resolve(true)
    })
  })
}

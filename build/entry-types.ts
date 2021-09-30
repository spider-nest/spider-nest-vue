import path from 'path'
import fs from 'fs-extra'
import { bold } from 'chalk'
import glob from 'fast-glob'
import { Project, ScriptTarget, ModuleKind } from 'ts-morph'
import { parallel } from 'gulp'

import { snRoot, buildOutput, projRoot } from './utils/paths'
import { yellow, green } from './utils/log'
import { withTaskName } from './utils/gulp'
import { run } from './utils/process'

import { buildConfig } from './info'

import type { SourceFile } from 'ts-morph'

import type { Module } from './info'

const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.json')

export const genEntryTypes = async () => {
  const files = await glob('*.ts', {
    cwd: snRoot,
    absolute: true,
    onlyFiles: true,
  })
  const project = new Project({
    compilerOptions: {
      module: ModuleKind.ESNext,
      allowJs: true,
      emitDeclarationOnly: true,
      noEmitOnError: false,
      outDir: path.resolve(buildOutput, 'entry/types'),
      target: ScriptTarget.ESNext,
      rootDir: snRoot,
      strict: false,
    },
    skipFileDependencyResolution: true,
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  })
  const sourceFiles: SourceFile[] = []
  files.map((f) => {
    const sourceFile = project.addSourceFileAtPath(f)
    sourceFiles.push(sourceFile)
  })
  project.addSourceFilesAtPaths(path.resolve(projRoot, 'typings', '*.d.ts'))

  const diagnostics = project.getPreEmitDiagnostics()

  console.log(project.formatDiagnosticsWithColorAndContext(diagnostics))

  await project.emit({
    emitOnlyDtsFiles: true,
  })

  const tasks = sourceFiles.map(async (sourceFile) => {
    yellow(`Emitting file: ${bold(sourceFile.getFilePath())}`)

    const emitOutput = sourceFile.getEmitOutput()
    for (const outputFile of emitOutput.getOutputFiles()) {
      const filepath = outputFile.getFilePath()

      await fs.mkdirSync(path.dirname(filepath), { recursive: true })

      const outputFileText = outputFile.getText()
      await fs.writeFileSync(
        filepath,
        outputFileText
          ? outputFileText.replaceAll('@spider-nest-vue', '.')
          : outputFileText,
        'utf8'
      )
      green(`Definition for file: ${bold(sourceFile.getBaseName())} generated`)
    }
  })

  await Promise.all(tasks)
}

export const copyEntryTypes = (() => {
  const src = path.resolve(buildOutput, 'entry/types')
  const copy = (module: Module) =>
    parallel(
      withTaskName(`copyEntryTypes:${module}`, () =>
        run(`cp -r ${src}/. ${buildConfig[module].output.path}/`)
      ),
      withTaskName('copyEntryDefinitions', async () => {
        const files = await glob('*.d.ts', {
          cwd: snRoot,
          absolute: true,
          onlyFiles: true,
        })
        await run(
          `cp -r ${files.join(' ')} ${buildConfig[module].output.path}/`
        )
      })
    )

  return parallel(copy('esm'), copy('cjs'))
})()

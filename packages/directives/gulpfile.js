import path from 'path'
import gulp from 'gulp'
import { buildOutput } from '../../build/utils/paths'
import rewriter from '../../build/gulp-rewriter'

export const esm = './es'
export const cjs = './lib'

const inputs = [
  './**/*.js',
  '!./node_modules',
  '!./__tests__/*.js',
  '!./gulpfile.js',
]

function compileEsm() {
  return gulp.src(inputs).pipe(rewriter()).pipe(gulp.dest(esm))
}

function compileCjs() {
  return gulp.src(inputs).pipe(rewriter()).pipe(gulp.dest(cjs))
}

const distBundle = path.resolve(buildOutput, './spider-nest-vue')

/**
 * copy from packages/theme-chalk/lib to dist/theme-chalk
 */
function copyEsm() {
  return gulp
    .src(`${esm}/**`)
    .pipe(gulp.dest(path.resolve(distBundle, 'es/directives')))
}

function copyCjs() {
  return gulp
    .src(`${cjs}/**`)
    .pipe(gulp.dest(path.resolve(distBundle, 'lib/directives')))
}

export const build = gulp.series(compileEsm, compileCjs, copyEsm, copyCjs)

export default build

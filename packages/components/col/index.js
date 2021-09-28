import Col from './src/col'

const _Col = Col

_Col.install = (app) => {
  app.component(_Col.name, _Col)
}

export default _Col

export const SnCol = _Col

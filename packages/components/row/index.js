import Row from './src/row'

const _Row = Row

_Row.install = (app) => {
  app.component(_Row.name, _Row)
}

export default _Row
export const SnRow = _Row

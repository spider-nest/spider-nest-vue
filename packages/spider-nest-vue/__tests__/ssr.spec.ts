/**
 * @jest-environment node
 */

describe('SSR', () => {
  test('require', () => {
    try {
      process.env.VUE_ENV = 'server'
      require('../index')
    } catch (e: any) {
      throw Error(e)
    }
    expect('pass').toBe('pass')
  })
})

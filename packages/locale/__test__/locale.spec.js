import { t, use, i18n, restoreHandler } from '../index'
import zhCn from '../lang/zh-cn'
import en from '../lang/en'

describe('Locale', () => {
  test('t', () => {
    expect(t('sn.popConfirm.confirmButtonText')).toBe('Yes')
  })

  test('return key name if not defined', () => {
    expect(t('sn.popConfirm.someThing')).toBeUndefined()
  })

  test('use', () => {
    use(zhCn)
    expect(t('sn.popConfirm.confirmButtonText')).toBe('确定')
    use(en)
    expect(t('sn.popConfirm.confirmButtonText')).toBe('Yes')
  })

  test('external i18n function', () => {
    const emptyKey = 'sn.popConfirm.confirmButtonText'
    const translator = jest.fn().mockImplementation((k) => {
      if (k === emptyKey) return ''
      return k
    })

    i18n(translator)
    const key = 'test'
    expect(t(key)).toBe(key)
    expect(t(emptyKey)).toBe('Yes')
    restoreHandler()
  })
})

import { setConfig } from '@spider-nest-vue/utils/config'
import { LocaleInjectionKey, localeProviderMaker } from '@spider-nest-vue/hooks'

import { version } from './version'

const makeInstaller = (components = []) => {
  const apps = []

  const install = (app, opts) => {
    const defaultInstallOpt = {
      size: '',
      zIndex: 2000,
    }

    const option = Object.assign(defaultInstallOpt, opts)
    if (apps.includes(app)) return
    apps.push(app)

    components.forEach((c) => {
      app.use(c)
    })

    if (option.locale) {
      const localeProvides = localeProviderMaker(opts.locale)
      app.provide(LocaleInjectionKey, localeProvides)
    }

    app.config.globalProperties.$ELEMENT = option
    // app.provide() ? is this better? I think its not that flexible but worth implement
    setConfig(option)
  }

  return {
    version,
    install,
  }
}

export default makeInstaller

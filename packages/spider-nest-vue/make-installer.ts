import { setConfig } from '@spider-nest-vue/utils/config'
import { LocaleInjectionKey, localeProviderMaker } from '@spider-nest-vue/hooks'

import { version } from './version'

import type { App, Plugin } from 'vue'

import type { ComponentSize } from '@spider-nest-vue/utils/types'
import type { InstallOptions } from '@spider-nest-vue/utils/config'

const makeInstaller = (components: Plugin[] = []) => {
  const apps: App[] = []

  const install = (app: App, opts: InstallOptions) => {
    const defaultInstallOpt: InstallOptions = {
      size: '' as ComponentSize,
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
      app.provide(LocaleInjectionKey, localeProvides as any)
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

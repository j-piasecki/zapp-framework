import { ApplicationConfig } from '@zapp/core'
import { NavigatorData } from './Navigator.js'
import { KeyValueStorage } from './KeyValueStorage.js'

export function Application(config: ApplicationConfig) {
  const navigatorData: NavigatorData = {
    currentPage: 'index',
    navStack: [],
    savedStates: [],
    registeredCallbacks: [],
    shouldRestore: false,
  }

  App({
    globalData: {
      _navigator: navigatorData,
      _keyValue: {},
    },
    onCreate(params: string) {
      KeyValueStorage.load()
      config.onInit?.(params)
    },

    onDestroy() {
      config.onDestroy?.()
      KeyValueStorage.save()
    },
  })
}

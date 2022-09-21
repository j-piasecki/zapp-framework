import { ApplicationConfig } from '@zapp/core'
import { NavigatorData } from './Navigator.js'

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
    },
    onCreate(params: string) {
      config.onInit?.(params)
    },

    onDestroy() {
      config.onDestroy?.()
    },
  })
}

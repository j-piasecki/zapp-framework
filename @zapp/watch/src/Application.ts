import { ApplicationConfig } from '@zapp/core'

export function Application(config: ApplicationConfig) {
  App({
    globalData: {
      _navigator: {
        currentPage: 'index',
        stack: [],
        savedStates: [],
        registeredCallbacks: [],
        shouldRestore: false,
      },
    },
    onCreate(params: string) {
      config.onInit?.(params)
    },

    onDestroy() {
      config.onDestroy?.()
    },
  })
}

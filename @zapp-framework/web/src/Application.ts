import { ApplicationConfig } from '@zapp-framework/core'

export function Application(config: ApplicationConfig) {
  config.onInit?.()

  window.addEventListener('beforeunload', () => {
    config.onDestroy?.()
  })
}

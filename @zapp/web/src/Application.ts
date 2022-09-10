import { ApplicationConfig } from '@zapp/core'

export function Application(config: ApplicationConfig) {
  config.onInit?.()

  window.addEventListener('beforeunload', () => {
    config.onDestroy?.()
  })
}

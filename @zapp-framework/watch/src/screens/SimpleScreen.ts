import { ScreenBody, ConfigBuilder } from '@zapp-framework/core'
import { PageWrapper } from './PageWrapper.js'
import { viewManagerInstance } from './../WatchViewManager.js'

export function SimpleScreen(configBuilder: ConfigBuilder, body?: (params?: Record<string, unknown>) => void) {
  PageWrapper({
    build: (params) => {
      ScreenBody(configBuilder, () => {
        body?.(params)
      })
    },
    initialize: () => {
      hmUI.setLayerScrolling(false)
      viewManagerInstance.setNoScrolling()
    },
  })
}

import { ScreenBody, ConfigBuilderArg } from '@zapp/core'
import { PageWrapper } from './PageWrapper.js'
import { viewManagerInstance } from './WatchViewManager.js'

export function SimpleScreen(configBuilder: ConfigBuilderArg, body?: (params?: Record<string, unknown>) => void) {
  PageWrapper({
    build: (params) => {
      ScreenBody(configBuilder, () => {
        body?.(params)
      })
    },
    initialize: () => {
      viewManagerInstance.pageScrollingEnabled = false
    },
  })
}

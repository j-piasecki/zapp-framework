import { ScreenBody, ConfigBuilderArg, Zapp, EventManager } from '@zapp/core'

export function SimpleScreen(configBuilder: ConfigBuilderArg, body?: (params?: Record<string, unknown>) => void) {
  Page({
    onInit(params) {
      this.receivedParams = params === undefined ? {} : JSON.parse(params)

      Zapp.startLoop()

      hmUI.setLayerScrolling(false)
      hmApp.registerGestureEvent(function (_event: unknown) {
        return EventManager.hasCapturedPointers()
      })
    },
    build() {
      ScreenBody(configBuilder, () => {
        body?.(this.receivedParams)
      })
    },
    onDestroy() {
      Zapp.stopLoop()
      hmApp.unregisterGestureEvent()
    },
  })
}

import { ScreenBody, ConfigBuilderArg, Zapp, EventManager } from '@zapp/core'

declare global {
  const Page: (config: { onInit?: (params: any) => void; build: () => void; onDestroy?: () => void }) => void
}

export function Screen(configBuilder: ConfigBuilderArg, body?: (params?: Record<string, unknown>) => void) {
  Page({
    onInit(params) {
      Zapp.startLoop()

      hmUI.setLayerScrolling(false)
      hmApp.registerGestureEvent(function (_event: unknown) {
        return EventManager.hasCapturedPointers()
      })
    },
    build() {
      ScreenBody(configBuilder, body)
    },
    onDestroy() {
      Zapp.stopLoop()
      hmApp.unregisterGestureEvent()
    },
  })
}

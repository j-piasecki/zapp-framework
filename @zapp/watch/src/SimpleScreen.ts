import {
  ScreenBody,
  ConfigBuilderArg,
  Zapp,
  PointerEventManager,
  WorkingTree,
  Navigator,
  GlobalEventManager,
} from '@zapp/core'

export function SimpleScreen(configBuilder: ConfigBuilderArg, body?: (params?: Record<string, unknown>) => void) {
  Page({
    onInit(params) {
      this.receivedParams = params === undefined ? {} : JSON.parse(params)

      Zapp.startLoop()

      const navigatorData = getApp()._options.globalData._navigator
      if (navigatorData.shouldRestore as boolean) {
        navigatorData.shouldRestore = false
        WorkingTree.restoreState(navigatorData.savedStates.pop())
      }

      hmUI.setLayerScrolling(false)
      hmApp.registerGestureEvent(function (event: unknown) {
        if (PointerEventManager.hasCapturedPointers()) {
          return true
        }

        if (event === hmApp.gesture.RIGHT) {
          Navigator.goBack()
          return true
        }

        return false
      })

      hmApp.registerSpinEvent((_key: unknown, degree: number) => {
        return GlobalEventManager.dispatchCrownEvent(degree)
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
      hmApp.unregistSpinEvent()
    },
  })
}

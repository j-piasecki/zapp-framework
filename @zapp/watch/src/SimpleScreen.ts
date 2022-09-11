import {
  ScreenBody,
  ConfigBuilderArg,
  Zapp,
  PointerEventManager,
  WorkingTree,
  Navigator,
  GlobalEventManager,
  GestureType,
} from '@zapp/core'

function mapGesture(gesture: unknown): GestureType {
  switch (gesture) {
    case hmApp.gesture.UP:
      return GestureType.Up
    case hmApp.gesture.DOWN:
      return GestureType.Down
    case hmApp.gesture.RIGHT:
      return GestureType.Right
    default:
      return GestureType.Left
  }
}

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

        if (GlobalEventManager.dispatchGestureEvent(mapGesture(event))) {
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

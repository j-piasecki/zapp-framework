import {
  ScreenBody,
  ConfigBuilderArg,
  Zapp,
  PointerEventManager,
  WorkingTree,
  Navigator,
  GlobalEventManager,
  GestureType,
  EventType,
  ButtonAction,
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

      hmApp.registerKeyEvent((key: unknown, sourceAction: unknown) => {
        let type: EventType | null = null
        let action: ButtonAction | null = null

        switch (key) {
          case hmApp.key.HOME:
            type = EventType.HomeButton
            break
          case hmApp.key.SHORTCUT:
            type = EventType.ShortcutButton
            this.text = ''
            break
        }

        switch (sourceAction) {
          case hmApp.action.RELEASE:
            action = ButtonAction.Release
            break
          case hmApp.action.PRESS:
            action = ButtonAction.Press
            break
        }

        if (type !== null && action !== null) {
          GlobalEventManager.dispatchButtonEvent(type, action)
        }

        return key === hmApp.key.HOME || key === hmApp.key.SHORTCUT
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
      hmApp.unregisterKeyEvent()
    },
  })
}

import {
  ScreenBody,
  ConfigBuilder,
  RememberedMutableValue,
  rememberObservable,
  PointerEventManager,
} from '@zapp-framework/core'
import { PageWrapper } from './PageWrapper.js'
import { viewManagerInstance } from './../WatchViewManager.js'
import { navigatorInstance } from '../Navigator.js'

let rememberedValues: RememberedMutableValue<number>[] = []
let previousScroll = 0

export function ScrollableScreen(
  configBuilder: ConfigBuilder,
  body?: (params?: Record<string, unknown>) => void
) {
  PageWrapper({
    build: (params) => {
      ScreenBody(configBuilder, () => {
        body?.(params)
      })
    },
    initialize: () => {
      hmUI.setLayerScrolling(true)

      viewManagerInstance.setFreeScrolling()
    },
    destroy: () => {
      rememberedValues = []
    },

    restoreState: (scrollPosition: number) => {
      hmApp.setLayerY(-scrollPosition)
    },
  })
}

export function tryUpdatingRememberedScrollPositions() {
  const currentScroll = -hmApp.getLayerY()
  if (previousScroll !== currentScroll) {
    navigatorInstance.saveScreenState(currentScroll)
    PointerEventManager.cancelPointers()
  }

  let needsClear = false
  for (const val of rememberedValues) {
    val.value = currentScroll

    // @ts-ignore that's private in the core package
    needsClear = needsClear || val.context.isDropped
  }

  if (needsClear) {
    // @ts-ignore that's private in the core package
    rememberedValues = rememberedValues.filter((v) => !v.context.isDropped)
  }

  previousScroll = currentScroll
}

export function rememberScrollPosition(): RememberedMutableValue<number> {
  const value = rememberObservable(hmApp.getLayerY(), (prev, current) => {
    hmApp.setLayerY(-current)
  })
  if (rememberedValues.indexOf(value) === -1) {
    rememberedValues.push(value)
  }
  return value
}

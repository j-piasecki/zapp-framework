import {
  ScreenBody,
  ConfigBuilder,
  RememberedMutableValue,
  rememberObservable,
  Config,
  Stack,
  PointerEventManager,
} from '@zapp/core'
import { PageWrapper } from './PageWrapper.js'
import { viewManagerInstance } from './../WatchViewManager.js'

let rememberedScroll: RememberedMutableValue<number> | undefined = undefined
let rememberedValues: RememberedMutableValue<number>[] = []
let previousScroll = 0

export function ScrollableScreen(configBuilder: ConfigBuilder, body?: (params?: Record<string, unknown>) => void) {
  PageWrapper({
    build: (params) => {
      Stack(Config('rememberedScrollPosition'), () => {
        rememberedScroll = rememberObservable(-hmApp.getLayerY(), undefined, (restored) => {
          hmApp.setLayerY(-restored)
        })
      })

      ScreenBody(configBuilder, () => {
        body?.(params)
      })
    },
    initialize: () => {
      hmUI.setLayerScrolling(true)

      viewManagerInstance.setFreeScrolling()
    },
    destroy: () => {
      rememberedScroll = undefined
      rememberedValues = []
    },
  })
}

export function tryUpdatingRememberedScrollPositions() {
  const currentScroll = -hmApp.getLayerY()
  if (previousScroll !== currentScroll) {
    PointerEventManager.cancelPointers()
  }

  if (rememberedScroll !== undefined) {
    rememberedScroll.value = currentScroll
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

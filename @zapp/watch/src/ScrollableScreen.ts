import {
  ScreenBody,
  ConfigBuilderArg,
  RememberedMutableValue,
  rememberObservable,
  Config,
  Custom,
  sideEffect,
  Stack,
} from '@zapp/core'
import { PageWrapper } from './PageWrapper.js'
import { viewManagerInstance } from './WatchViewManager.js'

let rememberedScroll: RememberedMutableValue<number> | undefined = undefined
let rememberedValues: RememberedMutableValue<number>[] = []

export function ScrollableScreen(configBuilder: ConfigBuilderArg, body?: (params?: Record<string, unknown>) => void) {
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
  if (rememberedScroll !== undefined) {
    rememberedScroll.value = currentScroll
  }
  for (const val of rememberedValues) {
    val.value = currentScroll
  }
}

export function rememberScrollPosition(): RememberedMutableValue<number> {
  const value = rememberObservable(hmApp.getLayerY(), (prev, current) => {
    hmApp.setLayerY(-current)
  })
  rememberedValues.push(value)
  return value
}

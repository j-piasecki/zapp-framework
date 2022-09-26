import { ScreenBody, ConfigBuilderArg, RememberedMutableValue, rememberObservable, Config, Stack } from '@zapp/core'
import { PageWrapper } from './PageWrapper.js'
import { viewManagerInstance } from './../WatchViewManager.js'

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

    // @ts-ignore that's private in the core package
    needsClear = needsClear || val.context.isDropped
  }

  let needsClear = false
  for (const val of rememberedValues) {
    val.value = currentScroll
  }

  if (needsClear) {
    // @ts-ignore that's private in the core package
    rememberedValues = rememberedValues.filter((v) => !v.context.isDropped)
  }
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

import {
  RememberedMutableValue,
  rememberObservable,
  PointerEventManager,
} from '@zapp-framework/core'

let rememberedValues: RememberedMutableValue<number>[] = []
let previousScroll = 0

export function tryUpdatingRememberedScrollPositions() {
  const currentScroll = window.scrollY
  if (previousScroll !== currentScroll) {
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
  const value = rememberObservable(window.scrollY, (prev, current) => {
    window.scrollTo(0, current)
  })
  if (rememberedValues.indexOf(value) === -1) {
    rememberedValues.push(value)
  }
  return value
}

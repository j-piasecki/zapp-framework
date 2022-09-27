import '@zapp/watch'
import { Theme } from '@zapp/ui'
import { Color, Stack, StackConfig, remember, withTiming } from '@zapp/core'

export function Clickable(config, body) {
  const rawConfig = config.build()

  Stack(StackConfig(`${rawConfig.id}#wrapper`), () => {
    const pressed = remember(false)
    const pressPosition = remember({ x: 0, y: 0 })
    const background = remember(Theme.background)
    const timer = remember(0)

    const cancelPress = () => {
      pressed.value = false
      background.value = Theme.background
    }

    const backgroundConfig = StackConfig(`${rawConfig.id}#background`)
      .background(background.value)
      .onPointerDown((e) => {
        pressed.value = true
        pressPosition.value = { x: e.x, y: e.y }
        background.value = Color.accent(Theme.background, 0.1)

        timer.value = withTiming(0, {
          duration: 500,
          onEnd: () => {
            cancelPress()
          },
        })
      })
      .onPointerUp(() => {
        if (pressed.value) {
          cancelPress()
          rawConfig.onPress?.()
        }
      })
      .onPointerMove((e) => {
        if (
          Math.sqrt(
            (e.x - pressPosition.value.x) * (e.x - pressPosition.value.x) +
              (e.y - pressPosition.value.y) * (e.y - pressPosition.value.y)
          ) > px(16)
        ) {
          cancelPress()
        }
      })
      .onPointerLeave(cancelPress)

    Stack(backgroundConfig, body)
  })
}

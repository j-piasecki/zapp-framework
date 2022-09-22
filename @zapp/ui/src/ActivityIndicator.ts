import { Arc, ArcConfigBuilder, Config, remember, sideEffect, Stack, withTiming } from '@zapp/core'
import { Theme } from './Theme.js'

export function ActivityIndicator(config: ArcConfigBuilder) {
  const rawConfig = config.build()
  Stack(Config(`${rawConfig.id}#wrapper`), () => {
    const angle = remember(-90)
    const size = remember(10)

    function animateCycle() {
      angle.value = -90
      angle.value = withTiming(270, {
        duration: 1000,
        onEnd: (completed) => {
          if (completed) {
            animateCycle()
          }
        },
      })
      size.value = withTiming(120, {
        duration: 500,
        onEnd: (completed) => {
          if (completed) {
            size.value = withTiming(10, { duration: 500 })
          }
        },
      })
    }

    sideEffect(animateCycle)

    if (rawConfig.borderColor === undefined) {
      config.color(Theme.primary)
    }

    Arc(config.startAngle(angle.value).endAngle(angle.value + size.value))
  })
}

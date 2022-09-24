import { Arc, ArcConfigBuilder, Config, remember, sideEffect, Stack, withRepeat, withTiming } from '@zapp/core'
import { Theme } from './Theme.js'

// TODO: consider making separate config & builder
export function ActivityIndicator(config: ArcConfigBuilder) {
  const rawConfig = config.build()
  Stack(Config(`${rawConfig.id}#wrapper`).positionAbsolutely(rawConfig.isPositionedAbsolutely!), () => {
    const angle = remember(-90)
    const size = remember(30)

    sideEffect(() => {
      angle.value = withRepeat(withTiming(270, { duration: 1000 }))
      size.value = withRepeat(withTiming(120, { duration: 500 }), { reverse: true })
    })

    if (rawConfig.borderColor === undefined) {
      config.color(Theme.primary)
    }

    Arc(config.startAngle(angle.value).endAngle(angle.value + size.value))
  })
}

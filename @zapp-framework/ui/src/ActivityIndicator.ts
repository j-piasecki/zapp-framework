import {
  Arc,
  ArcConfig,
  Config,
  ConfigBuilder,
  ConfigType,
  remember,
  sideEffect,
  Stack,
  withRepeat,
  withTiming,
} from '@zapp-framework/core'
import { Theme } from './Theme.js'

interface ActivityIndicatorConfigType extends ConfigType {
  size: number
}

export class ActivityIndicatorConfigBuilder extends ConfigBuilder {
  protected config: ActivityIndicatorConfigType

  constructor(id: string) {
    super(id)
    this.config.size = px(80)
    this.config.lineWidth = px(10)
  }

  lineWidth(lineWidth: number) {
    this.config.lineWidth = lineWidth
    return this
  }

  size(size: number) {
    this.config.size = size
    return this
  }

  build(): ActivityIndicatorConfigType {
    return this.config
  }
}

export function ActivityIndicatorConfig(id: string): ActivityIndicatorConfigBuilder {
  return new ActivityIndicatorConfigBuilder(id)
}

export function ActivityIndicator(config: ActivityIndicatorConfigBuilder) {
  const rawConfig = config.build()

  Stack(Config(`${rawConfig.id}#wrapper`).positionAbsolutely(rawConfig.isPositionedAbsolutely!), () => {
    const angle = remember(-90)
    const size = remember(30)

    sideEffect(() => {
      angle.value = withRepeat(withTiming(270, { duration: 1000 }))
      size.value = withRepeat(withTiming(120, { duration: 500 }), { reverse: true })
    })

    Arc(
      ArcConfig(rawConfig.id)
        .startAngle(angle.value)
        .endAngle(angle.value + size.value)
        .width(rawConfig.size)
        .height(rawConfig.size)
        .lineWidth(rawConfig.lineWidth!)
        .color(Theme.primary)
    )
  })
}

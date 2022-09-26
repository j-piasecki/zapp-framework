import {
  ConfigType,
  ConfigBuilder,
  Stack,
  StackConfig,
  remember,
  sideEffect,
  withTiming,
  Easing,
  Color,
} from '@zapp/core'
import { Theme } from './Theme.js'

interface SwitchConfigType extends ConfigType {
  isChecked: boolean
  onChange?: (isChecked: boolean) => void
}

export class SwitchConfigBuilder extends ConfigBuilder {
  protected config: SwitchConfigType

  constructor(id: string) {
    super(id)
    this.config.isChecked = false
  }

  isChecked(isChecked: boolean) {
    this.config.isChecked = isChecked
    return this
  }

  onChange(handler: (isChecked: boolean) => void) {
    this.config.onChange = handler
    return this
  }

  build(): SwitchConfigType {
    return this.config
  }
}

export function SwitchConfig(id: string): SwitchConfigBuilder {
  return new SwitchConfigBuilder(id)
}

export function Switch(config: SwitchConfigBuilder) {
  const rawConfig = config.build()

  const [r, g, b] = Color.toRGB(rawConfig.isChecked ? Theme.primaryContainer : Theme.surfaceVariant)

  Stack(StackConfig(`${rawConfig.id}#wrapper`), () => {
    const pressed = remember(false)
    const pressPosition = remember({ x: 0, y: 0 })
    const foregroundOffset = remember(rawConfig.isChecked ? px(60) : 0)

    const backgroundR = remember(r)
    const backgroundG = remember(g)
    const backgroundB = remember(b)

    sideEffect(() => {
      const animationConfig = { duration: 200, easing: Easing.easeOutQuad }
      const [r, g, b] = Color.toRGB(rawConfig.isChecked ? Theme.primaryContainer : Theme.surfaceVariant)

      foregroundOffset.value = withTiming(rawConfig.isChecked ? px(60) : 0, animationConfig)
      backgroundR.value = withTiming(r, animationConfig)
      backgroundG.value = withTiming(g, animationConfig)
      backgroundB.value = withTiming(b, animationConfig)
    }, rawConfig.isChecked)

    Stack(
      StackConfig(`${rawConfig.id}#background`)
        .width(px(120))
        .height(px(60))
        .cornerRadius(px(30))
        .background(Color.rgb(backgroundR.value, backgroundG.value, backgroundB.value))
        .padding(px(10))
        .onPointerDown((e) => {
          pressed.value = true
          pressPosition.value = { x: e.x, y: e.y }
        })
        .onPointerUp(() => {
          if (pressed.value) {
            pressed.value = false
            rawConfig.onChange?.(!rawConfig.isChecked)
          }
        })
        .onPointerMove((e) => {
          if (
            Math.sqrt(
              (e.x - pressPosition.value.x) * (e.x - pressPosition.value.x) +
                (e.y - pressPosition.value.y) * (e.y - pressPosition.value.y)
            ) > px(24)
          ) {
            pressed.value = false
          }
        })
        .onPointerLeave(() => {
          pressed.value = false
        }),
      () => {
        Stack(
          StackConfig(`${rawConfig.id}#foreground`)
            .width(px(40))
            .height(px(40))
            .cornerRadius(px(20))
            .background(Theme.onPrimaryContainer)
            .offset(foregroundOffset.value, 0)
        )
      }
    )
  })
}

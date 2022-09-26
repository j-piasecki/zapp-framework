import {
  ConfigType,
  ConfigBuilder,
  Alignment,
  Color,
  Easing,
  remember,
  Row,
  RowConfig,
  sideEffect,
  Stack,
  StackAlignment,
  StackConfig,
  withTiming,
} from '@zapp/core'
import { Theme } from './Theme.js'

interface CheckBoxConfigType extends ConfigType {
  checked: boolean
  onChange?: (checked: boolean) => void
}

export class CheckBoxConfigBuilder extends ConfigBuilder {
  protected config: CheckBoxConfigType

  constructor(id: string) {
    super(id)
    this.config.checked = false
  }

  onChange(handler: (checked: boolean) => void) {
    this.config.onChange = handler
    return this
  }

  checked(checked: boolean) {
    this.config.checked = checked
    return this
  }

  build(): CheckBoxConfigType {
    return this.config
  }
}

export function CheckBoxConfig(id: string): CheckBoxConfigBuilder {
  return new CheckBoxConfigBuilder(id)
}

export function CheckBox(config: CheckBoxConfigBuilder, body?: () => void) {
  const rawConfig = config.build()

  const [r, g, b] = Color.toRGB(rawConfig.checked ? Theme.primaryContainer : Theme.surfaceVariant)

  Stack(StackConfig(`${rawConfig.id}#wrapper`), () => {
    const pressed = remember(false)
    const pressPosition = remember({ x: 0, y: 0 })

    Row(
      RowConfig(`${rawConfig.id}#row`)
        .alignment(Alignment.Center)
        .padding(px(8))
        .onPointerDown((e) => {
          pressed.value = true
          pressPosition.value = { x: e.x, y: e.y }
        })
        .onPointerUp(() => {
          if (pressed.value) {
            pressed.value = false
            rawConfig.onChange?.(!rawConfig.checked)
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
        const foregroundSize = remember(rawConfig.checked ? px(30) : 0)
        const backgroundR = remember(r)
        const backgroundG = remember(g)
        const backgroundB = remember(b)

        sideEffect(() => {
          const animationConfig = { duration: 200, easing: Easing.easeOutQuad }
          const [r, g, b] = Color.toRGB(rawConfig.checked ? Theme.primaryContainer : Theme.surfaceVariant)

          foregroundSize.value = withTiming(rawConfig.checked ? px(30) : 0, animationConfig)
          backgroundR.value = withTiming(r, animationConfig)
          backgroundG.value = withTiming(g, animationConfig)
          backgroundB.value = withTiming(b, animationConfig)
        }, rawConfig.checked)

        Stack(
          StackConfig(`${rawConfig.id}#background`)
            .alignment(StackAlignment.Center)
            .width(px(60))
            .height(px(60))
            .cornerRadius(px(15))
            .background(Color.rgb(backgroundR.value, backgroundG.value, backgroundB.value))
            .padding(px(15)),
          () => {
            Stack(
              StackConfig(`${rawConfig.id}#foreground`)
                .width(foregroundSize.value)
                .height(foregroundSize.value)
                .cornerRadius(foregroundSize.value / 4)
                .background(Theme.onPrimaryContainer)
            )
          }
        )
        Stack(StackConfig(`${rawConfig.id}#spacer`).width(px(16)))
        body?.()
      }
    )
  })
}

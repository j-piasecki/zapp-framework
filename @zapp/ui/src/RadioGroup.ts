import {
  Alignment,
  Color,
  ConfigBuilder,
  ConfigType,
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

interface RadioGroupConfigType extends ConfigType {
  selected: number
  onChange?: (selected: number) => void
}

export class RadioGroupConfigBuilder extends ConfigBuilder {
  protected config: RadioGroupConfigType

  constructor(id: string) {
    super(id)
    this.config.selected = 0
  }

  onChange(handler: (selected: number) => void) {
    this.config.onChange = handler
    return this
  }

  selected(selected: number) {
    this.config.selected = selected
    return this
  }

  build(): RadioGroupConfigType {
    return this.config
  }
}

export function RadioGroupConfig(id: string): RadioGroupConfigBuilder {
  return new RadioGroupConfigBuilder(id)
}

let nextButtonIndex = 0
let currentConfig: RadioGroupConfigType

export function RadioGroup(config: RadioGroupConfigBuilder, body: () => void) {
  const rawConfig = config.build()

  nextButtonIndex = 0
  currentConfig = rawConfig

  body()
}

export function RadioButton(config: ConfigBuilder, body?: () => void) {
  const rawConfig = config.build()
  const index = nextButtonIndex++
  const selected = index === currentConfig.selected

  const [r, g, b] = Color.toRGB(selected ? Theme.primaryContainer : Theme.surfaceVariant)

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
            currentConfig.onChange?.(index)
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
        const foregroundSize = remember(selected ? px(30) : 0)
        const backgroundR = remember(r)
        const backgroundG = remember(g)
        const backgroundB = remember(b)

        sideEffect(() => {
          const animationConfig = { duration: 200, easing: Easing.easeOutQuad }
          const [r, g, b] = Color.toRGB(selected ? Theme.primaryContainer : Theme.surfaceVariant)

          foregroundSize.value = withTiming(selected ? px(30) : 0, animationConfig)
          backgroundR.value = withTiming(r, animationConfig)
          backgroundG.value = withTiming(g, animationConfig)
          backgroundB.value = withTiming(b, animationConfig)
        }, selected)

        Stack(
          StackConfig(`${rawConfig.id}#background`)
            .alignment(StackAlignment.Center)
            .width(px(60))
            .height(px(60))
            .cornerRadius(px(30))
            .background(Color.rgb(backgroundR.value, backgroundG.value, backgroundB.value))
            .padding(px(15)),
          () => {
            Stack(
              StackConfig(`${rawConfig.id}#foreground`)
                .width(foregroundSize.value)
                .height(foregroundSize.value)
                .cornerRadius(foregroundSize.value / 2)
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

import {
  ConfigType,
  ConfigBuilder,
  Stack,
  StackConfig,
  StackAlignment,
  Zapp,
  Platform,
  remember,
  withTiming,
  Easing,
  Color,
} from '@zapp/core'
import { popTextColor, popTextSize, pushTextColor, pushTextSize } from './Text.js'
import { Theme } from './Theme.js'

const OUTER_PADDING = 4
const TEXT_SIZE = 32

export enum ButtonStyle {
  Filled,
  Outlined,
  BodyOnly,
}

interface ButtonConfigType extends ConfigType {
  style: ButtonStyle
  onPress?: () => void
  background?: number
}

export class ButtonConfigBuilder extends ConfigBuilder {
  protected config: ButtonConfigType

  constructor(id: string) {
    super(id)
    this.config.style = ButtonStyle.Filled
  }

  style(style: ButtonStyle) {
    this.config.style = style
    return this
  }

  onPress(handler: () => void) {
    this.config.onPress = handler
    return this
  }

  background(color: number) {
    this.config.background = color
    return this
  }

  build(): ButtonConfigType {
    return this.config
  }
}

export function ButtonConfig(id: string): ButtonConfigBuilder {
  return new ButtonConfigBuilder(id)
}

export function Button(config: ButtonConfigBuilder, body: () => void) {
  const rawConfig = config.build()

  Stack(StackConfig(`${rawConfig.id}#wrapper`), () => {
    const outerPadding = remember(OUTER_PADDING)

    Stack(
      StackConfig(`${rawConfig.id}#outerPadding`)
        .alignment(StackAlignment.Center)
        .positionAbsolutely(rawConfig.isPositionedAbsolutely!)
        .padding(px(outerPadding.value / 2), px(outerPadding.value)),
      () => {
        const pressed = remember(false)
        const pressPosition = remember({ x: 0, y: 0 })
        const background = remember(rawConfig.background ?? Theme.primary)

        const cancelPress = () => {
          pressed.value = false
          outerPadding.value = OUTER_PADDING
          background.value = rawConfig.background ?? Theme.primary
        }

        const backgroundConfig = StackConfig(`${rawConfig.id}#background`)
          .positionAbsolutely(true)
          .offset(outerPadding.value, outerPadding.value / 2)
          .cornerRadius(px(TEXT_SIZE + OUTER_PADDING))
          .padding(
            px(TEXT_SIZE * 1.25 + OUTER_PADDING - outerPadding.value),
            px(TEXT_SIZE * 0.35 + (OUTER_PADDING - outerPadding.value) / 2),
            px(TEXT_SIZE * 1.25 + OUTER_PADDING - outerPadding.value),
            px(TEXT_SIZE / 2 + (OUTER_PADDING - outerPadding.value) / 2)
          )
          .onPointerDown((e) => {
            pressed.value = true
            pressPosition.value = { x: e.x, y: e.y }
            outerPadding.value = 0
            background.value = Color.accent(rawConfig.background ?? Theme.primary, 0.1)
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
              ) > px(24)
            ) {
              cancelPress()
            }
          })
          .onPointerLeave(cancelPress)

        if (Zapp.platform === Platform.Web) {
          backgroundConfig.padding(
            px(TEXT_SIZE * 1.25 + OUTER_PADDING - outerPadding.value),
            px(TEXT_SIZE / 2 + (OUTER_PADDING - outerPadding.value) / 2),
            px(TEXT_SIZE * 1.25 + OUTER_PADDING - outerPadding.value),
            px(TEXT_SIZE * 0.4 + (OUTER_PADDING - outerPadding.value) / 2)
          )
        }

        let backgroundColor: number | undefined = undefined
        let borderColor: number | undefined = undefined

        if (rawConfig.style === ButtonStyle.Filled) {
          backgroundColor = background.value
          pushTextColor(Theme.onPrimary)
        } else if (rawConfig.style === ButtonStyle.Outlined) {
          backgroundConfig.borderWidth(px(2))
          borderColor = Theme.primary
          pushTextColor(Theme.primary)

          if (rawConfig.background !== undefined) {
            backgroundColor = background.value
          }
        } else {
          pushTextColor(Theme.primary)

          if (rawConfig.background !== undefined) {
            backgroundColor = background.value
          }
        }

        backgroundConfig.background(backgroundColor!)
        backgroundConfig.borderColor(borderColor!)

        pushTextSize(px(TEXT_SIZE))

        Stack(backgroundConfig, body)

        popTextColor()
        popTextSize()
      }
    )
  })
}

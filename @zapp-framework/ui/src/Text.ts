import { TextConfig, BareText } from '@zapp-framework/core'
import { Theme } from './Theme.js'

const nextColors: number[] = []
const nextFontSizes: number[] = []

const DEFAULT_TEXT_SIZE = 32

export function Text(config: ReturnType<typeof TextConfig>, text: string) {
  const rawConfig = config.build()

  const nextColor = nextColors[nextColors.length - 1]
  if (rawConfig.textColor === undefined && nextColor !== null) {
    config.textColor(nextColor)
  }

  const nextFontSize = nextFontSizes[nextFontSizes.length - 1]
  if (rawConfig.textSize === undefined && nextFontSize !== null) {
    config.textSize(nextFontSize)
  }

  if (rawConfig.textSize === undefined) {
    config.textSize(DEFAULT_TEXT_SIZE)
  }
  if (rawConfig.textColor === undefined) {
    config.textColor(Theme.onBackground)
  }

  BareText(config, text)
}

export function pushTextColor(color: number) {
  nextColors.push(color)
}

export function popTextColor() {
  nextColors.pop()
}

export function pushTextSize(size: number) {
  nextFontSizes.push(size)
}

export function popTextSize() {
  nextFontSizes.pop()
}

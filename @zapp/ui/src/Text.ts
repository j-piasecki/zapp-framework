import { TextConfigBuilder, BareText } from '@zapp/core'

const nextColors: number[] = []
const nextFontSizes: number[] = []

export function Text(config: TextConfigBuilder, text: string) {
  const rawConfig = config.build()

  const nextColor = nextColors[nextColors.length - 1]
  if (rawConfig.textColor === undefined && nextColor !== null) {
    config.textColor(nextColor)
  }

  const nextFontSize = nextFontSizes[nextFontSizes.length - 1]
  if (rawConfig.textSize === undefined && nextFontSize !== null) {
    config.textSize(nextFontSize)
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

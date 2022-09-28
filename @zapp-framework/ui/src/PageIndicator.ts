import {
  Arrangement,
  Column,
  ColumnConfig,
  ConfigBuilder,
  ConfigType,
  remember,
  Row,
  RowConfig,
  ScreenShape,
  Stack,
  StackAlignment,
  StackConfig,
  Zapp,
} from '@zapp-framework/core'
import { Theme } from './Theme.js'

const DOT_SIZE = px(16)
const DOT_SPACING = px(2)
const SPACE_FOR_DOT = DOT_SIZE + DOT_SPACING * 2

interface PageIndicatorConfigType extends ConfigType {
  numberOfPages: number
  currentPage: number
  curved: boolean
  curveRadius: number
  horizontal: boolean
}

export class PageIndicatorConfigBuilder extends ConfigBuilder {
  protected config: PageIndicatorConfigType

  constructor(id: string) {
    super(id)
    this.config.numberOfPages = 1
    this.config.currentPage = 0
    this.config.curveRadius = Zapp.screenWidth / 2
    this.config.curved = Zapp.screenShape === ScreenShape.Round
    this.config.horizontal = true
  }

  numberOfPages(numberOfPages: number) {
    this.config.numberOfPages = numberOfPages
    return this
  }

  currentPage(currentPage: number) {
    this.config.currentPage = currentPage
    return this
  }

  curveRadius(curveRadius: number) {
    this.config.curveRadius = curveRadius
    return this
  }

  curved(curved: boolean) {
    this.config.curved = curved
    return this
  }

  horizontal(horizontal: boolean) {
    this.config.horizontal = horizontal
    return this
  }

  build(): PageIndicatorConfigType {
    return this.config
  }
}

export function PageIndicatorConfig(id: string): PageIndicatorConfigBuilder {
  return new PageIndicatorConfigBuilder(id)
}

function calculateDotOffset(index: number, config: PageIndicatorConfigType, radius?: number) {
  let oX = 0
  let oY = 0

  if (config.curved) {
    let distanceFromCenter = index - Math.floor(config.numberOfPages / 2)
    if (config.numberOfPages % 2 === 0) {
      distanceFromCenter += 0.5
    }

    const r = (radius ?? config.curveRadius) - DOT_SIZE / 2
    const degPerDot = (180 * SPACE_FOR_DOT) / (Math.PI * r) // 360 * size / (2 * pi * r)
    const angularPosition = degPerDot * distanceFromCenter * 0.0174532925
    const relativePosition = distanceFromCenter * SPACE_FOR_DOT

    if (config.horizontal) {
      oY -= r * (1 - Math.cos(angularPosition))
      oX -= relativePosition - Math.sin(angularPosition) * r
    } else {
      oX -= r * (1 - Math.cos(angularPosition))
      oY -= relativePosition - Math.sin(angularPosition) * r
    }
  }

  return { x: oX, y: oY }
}

function renderDot(index: number, rawConfig: PageIndicatorConfigType) {
  const { x: offsetX, y: offsetY } = calculateDotOffset(index, rawConfig)

  Stack(
    StackConfig(`${rawConfig.id}#dot#${index}`)
      .background(index === rawConfig.currentPage ? Theme.primary : Theme.primaryContainer)
      .width(DOT_SIZE)
      .height(DOT_SIZE)
      .cornerRadius(DOT_SIZE / 2)
      .offset(offsetX, offsetY)
  )
}

function renderDots(rawConfig: PageIndicatorConfigType) {
  for (let i = 0; i < rawConfig.numberOfPages; i++) {
    renderDot(i, rawConfig)
  }
}

export function PageIndicator(config: PageIndicatorConfigBuilder) {
  const rawConfig = config.build()

  Stack(
    StackConfig(`${rawConfig.id}#wrapper`)
      .fillSize()
      .positionAbsolutely(true)
      .alignment(rawConfig.horizontal ? StackAlignment.BottomCenter : StackAlignment.CenterEnd),
    () => {
      if (rawConfig.horizontal) {
        Row(
          RowConfig(`${rawConfig.id}#dotsContainer`)
            .width(rawConfig.numberOfPages * SPACE_FOR_DOT)
            .arrangement(Arrangement.SpaceAround),
          () => {
            renderDots(rawConfig)
          }
        )
      } else {
        Column(
          ColumnConfig(`${rawConfig.id}#dotsContainer`)
            .height(rawConfig.numberOfPages * SPACE_FOR_DOT)
            .arrangement(Arrangement.SpaceAround),
          () => {
            renderDots(rawConfig)
          }
        )
      }
    }
  )
}

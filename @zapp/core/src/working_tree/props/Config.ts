import { RequireSome } from '../../utils'
import { ConfigType, PointerData } from './types'

export function Config(id: string) {
  return new ConfigBuilder(id)
}

export type ConfigBuilderArg = RequireSome<ConfigBuilder, 'build'>

export class ConfigBuilder {
  protected config: ConfigType

  constructor(id: string) {
    this.config = {
      id: id,
    }
  }

  public build() {
    return this.config
  }

  public merge(other: ConfigBuilder) {
    Object.assign(this.config, other.config)
    return this
  }

  public fillSize() {
    this.config.fillWidth = 1
    this.config.fillHeight = 1
    return this
  }

  public fillWidth(portion = 1) {
    this.config.fillWidth = portion
    return this
  }

  public fillHeight(portion = 1) {
    this.config.fillHeight = portion
    return this
  }

  public width(width: number) {
    this.config.width = width
    return this
  }

  public height(height: number) {
    this.config.height = height
    return this
  }

  public weight(weight: number) {
    this.config.weight = weight
    return this
  }

  public padding(padding: number): this
  public padding(vertical: number, horizontal: number): this
  public padding(start: number, top: number, end: number, bottom: number): this
  public padding(start: number, top?: number, end?: number, bottom?: number) {
    if (top !== undefined && end !== undefined && bottom !== undefined) {
      this.config.padding = {
        start: start,
        top: top,
        end: end,
        bottom: bottom,
      }
    } else if (top !== undefined) {
      this.config.padding = {
        start: top,
        top: start,
        end: top,
        bottom: start,
      }
    } else {
      this.config.padding = {
        start: start,
        top: start,
        end: start,
        bottom: start,
      }
    }

    return this
  }

  public offset(x: number, y: number) {
    this.config.offsetX = x
    this.config.offsetY = y
    return this
  }

  public background(background: number) {
    this.config.background = background
    return this
  }

  public cornerRadius(radius: number) {
    this.config.cornerRadius = radius
    return this
  }

  public onPointerDown(onPointerDown: (event: PointerData) => void) {
    this.config.onPointerDown = onPointerDown
    return this
  }

  public onPointerMove(onPointerMove: (event: PointerData) => void) {
    this.config.onPointerMove = onPointerMove
    return this
  }

  public onPointerUp(onPointerUp: (event: PointerData) => void) {
    this.config.onPointerUp = onPointerUp
    return this
  }

  public onPointerEnter(onPointerEnter: (event: PointerData) => void) {
    this.config.onPointerEnter = onPointerEnter
    return this
  }

  public onPointerLeave(onPointerLeave: (event: PointerData) => void) {
    this.config.onPointerLeave = onPointerLeave
    return this
  }
}

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

  public offset(x: number, y: number) {
    this.config.offsetX = x
    this.config.offsetY = y
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

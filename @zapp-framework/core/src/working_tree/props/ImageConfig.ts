import { BaseConfigBuilder } from './BaseConfig.js'

export function ImageConfig(id: string) {
  return new ImageConfigBuilder(id)
}

export class ImageConfigBuilder extends BaseConfigBuilder {
  public innerOffset(x: number, y: number) {
    this.config.innerOffsetX = x
    this.config.innerOffsetY = y
    return this
  }

  public origin(x: number, y: number) {
    this.config.originX = x
    this.config.originY = y
    return this
  }

  public rotation(angle: number) {
    this.config.rotation = angle
    return this
  }
}

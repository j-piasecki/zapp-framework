import { BaseConfigBuilder } from './BaseConfig.js'

export function ArcConfig(id: string) {
  return new ArcConfigBuilder(id)
}

export class ArcConfigBuilder extends BaseConfigBuilder {
  constructor(id: string) {
    super(id)

    this.config.startAngle = 0
    this.config.endAngle = 360
  }

  public lineWidth(width: number) {
    this.config.lineWidth = width
    return this
  }

  public color(color: number) {
    this.config.borderColor = color
    return this
  }

  public startAngle(angle: number) {
    this.config.startAngle = angle
    return this
  }

  public endAngle(angle: number) {
    this.config.endAngle = angle
    return this
  }
}

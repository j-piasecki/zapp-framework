import { BaseConfigBuilder } from './BaseConfig.js'

export class LayoutConfigBuilder extends BaseConfigBuilder {
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

  public background(background: number) {
    this.config.background = background
    return this
  }

  public cornerRadius(radius: number) {
    this.config.cornerRadius = radius
    return this
  }

  public borderWidth(width: number) {
    this.config.borderWidth = width
    return this
  }

  public borderColor(color: number) {
    this.config.borderColor = color
    return this
  }
}

import { ConfigBuilder } from './Config.js'

export function TextConfig(id: string) {
  return new TextConfigBuilder(id)
}

export class TextConfigBuilder extends ConfigBuilder {
  public textColor(textColor: number) {
    this.config.textColor = textColor
    return this
  }

  public textSize(textSize: number) {
    this.config.textSize = textSize
    return this
  }
}

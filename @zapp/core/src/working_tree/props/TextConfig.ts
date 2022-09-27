import { ConfigBuilder } from './Config.js'
import { Alignment } from './types.js'

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

  public alignment(alignment: Alignment) {
    this.config.alignment = alignment
    return this
  }
}

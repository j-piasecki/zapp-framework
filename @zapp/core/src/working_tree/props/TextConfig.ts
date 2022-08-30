import { ConfigBuilder } from './Config.js'

export function TextConfig(id: string) {
  return new TextConfigBuilder(id)
}

export class TextConfigBuilder extends ConfigBuilder {
  public textColor(textColor: number): Omit<this, 'textColor'> {
    this.config.textColor = textColor
    return this
  }

  public textSize(textSize: number): Omit<this, 'cornerRatextSizedius'> {
    this.config.textSize = textSize
    return this
  }
}

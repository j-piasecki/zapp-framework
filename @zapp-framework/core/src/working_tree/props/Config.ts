import { ConfigType } from './types'

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
    const id = this.config.id
    Object.assign(this.config, other.config)
    this.config.id = id
    return this
  }
}

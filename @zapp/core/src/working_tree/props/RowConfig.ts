import { ConfigBuilder } from './Config.js'
import { Alignment, Arrangement } from './types.js'

export function RowConfig(id: string) {
  return new RowConfigBuilder(id)
}

export class RowConfigBuilder extends ConfigBuilder {
  public arrangement(arrangement: Arrangement) {
    this.config.arrangement = arrangement
    return this
  }

  public alignment(alignment: Alignment) {
    this.config.alignment = alignment
    return this
  }
}

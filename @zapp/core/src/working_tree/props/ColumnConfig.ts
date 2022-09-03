import { ConfigBuilder } from './Config.js'
import { Alignment, Arrangement } from './types.js'

export function ColumnConfig(id: string) {
  return new ColumnConfigBuilder(id)
}

export class ColumnConfigBuilder extends ConfigBuilder {
  public arrangement(arrangement: Arrangement) {
    this.config.arrangement = arrangement
    return this
  }

  public alignment(alignment: Alignment) {
    this.config.alignment = alignment
    return this
  }
}

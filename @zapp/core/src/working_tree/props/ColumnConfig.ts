import { ConfigBuilder } from './Config.js'
import { Alignment, Arrangement } from './types.js'

export function ColumnConfig(id: string) {
  return new ColumnConfigBuilder(id)
}

export class ColumnConfigBuilder extends ConfigBuilder {
  public arrangement(arrangement: Arrangement): Omit<this, 'arrangement'> {
    this.config.arrangement = arrangement
    return this
  }

  public alignment(alignment: Alignment): Omit<this, 'alignment'> {
    this.config.alignment = alignment
    return this
  }
}

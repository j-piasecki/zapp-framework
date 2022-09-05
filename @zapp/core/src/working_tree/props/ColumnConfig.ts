import { LayoutConfigBuilder } from './LayoutConfig.js'
import { Alignment, Arrangement } from './types.js'

export function ColumnConfig(id: string) {
  return new ColumnConfigBuilder(id)
}

export class ColumnConfigBuilder extends LayoutConfigBuilder {
  public arrangement(arrangement: Arrangement) {
    this.config.arrangement = arrangement
    return this
  }

  public alignment(alignment: Alignment) {
    this.config.alignment = alignment
    return this
  }
}

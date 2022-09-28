import { LayoutConfigBuilder } from './LayoutConfig.js'
import { Alignment, Arrangement } from './types.js'

export function RowConfig(id: string) {
  return new RowConfigBuilder(id)
}

export class RowConfigBuilder extends LayoutConfigBuilder {
  public arrangement(arrangement: Arrangement) {
    this.config.arrangement = arrangement
    return this
  }

  public alignment(alignment: Alignment) {
    this.config.alignment = alignment
    return this
  }
}

import { LayoutConfigBuilder } from './LayoutConfig.js'
import { StackAlignment } from './types.js'

export function StackConfig(id: string) {
  return new StackConfigBuilder(id)
}

export class StackConfigBuilder extends LayoutConfigBuilder {
  public alignment(alignment: StackAlignment) {
    this.config.stackAlignment = alignment
    return this
  }
}

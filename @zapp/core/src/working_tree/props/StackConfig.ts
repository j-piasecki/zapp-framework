import { ConfigBuilder } from './Config.js'
import { StackAlignment } from './types.js'

export function StackConfig(id: string) {
  return new StackConfigBuilder(id)
}

export class StackConfigBuilder extends ConfigBuilder {
  public alignment(alignment: StackAlignment) {
    this.config.stackAlignment = alignment
    return this
  }
}

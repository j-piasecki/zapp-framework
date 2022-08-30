import { ConfigBuilder } from './Config.js'

export function ColumnConfig(id: string) {
  return new ColumnConfigBuilder(id)
}

export class ColumnConfigBuilder extends ConfigBuilder {}

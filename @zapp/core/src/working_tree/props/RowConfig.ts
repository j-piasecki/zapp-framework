import { ConfigBuilder } from './Config.js'

export function RowConfig(id: string) {
  return new RowConfigBuilder(id)
}

export class RowConfigBuilder extends ConfigBuilder {}

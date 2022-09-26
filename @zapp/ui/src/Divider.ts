import { ConfigBuilder, Stack } from '@zapp/core'
import { Theme } from './Theme.js'

export class DividerConfigBuilder extends ConfigBuilder {
  constructor(id: string) {
    super(id)
    this.config.background = Theme.outline
  }

  color(color: number) {
    this.config.background = color
    return this
  }
}

export function DividerConfig(id: string): DividerConfigBuilder {
  return new DividerConfigBuilder(id)
}

export function Divider(config: DividerConfigBuilder) {
  const rawConfig = config.build()

  if (rawConfig.width === undefined && rawConfig.fillWidth === undefined) {
    config.width(1)
  }

  if (rawConfig.height === undefined && rawConfig.height === undefined) {
    config.height(1)
  }

  Stack(config)
}

export function Config(id: string) {
  return new ConfigBuilder(id)
}

export class ConfigBuilder {
  public id: string

  constructor(id: string) {
    this.id = id
  }
}

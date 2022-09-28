export interface ApplicationConfig {
  onInit?: (params?: string) => void
  onDestroy?: () => void
}

let applicationImplementation: (config: ApplicationConfig) => void

export function Application(config: ApplicationConfig) {
  applicationImplementation(config)
}

export function setApplicationImplementation(app: (config: ApplicationConfig) => void) {
  applicationImplementation = app
}

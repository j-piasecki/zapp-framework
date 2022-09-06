export {}

declare global {
  const hmSetting: any
  const hmUI: any
  const hmApp: any

  const Page: (config: { onInit?: (params: any) => void; build: () => void; onDestroy?: () => void }) => void
}

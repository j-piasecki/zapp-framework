export {}

declare global {
  const hmSetting: any
  const hmUI: any
  const hmApp: any

  const getApp: () => any
  const Page: (config: { onInit?: (params: string) => void; build: () => void; onDestroy?: () => void }) => void
}

// @ts-nocheck TODO: consider making this abstract and moving implementation
// to the watch package

export function Application(config: { onInit?: (params: string) => void; onDestroy?: () => void }) {
  App({
    globalData: {
      _navigator: {
        currentPage: 'index',
        stack: [],
        savedStates: [],
        shouldRestore: false,
      },
    },
    onCreate(options) {
      config.onInit?.(options)
    },

    onDestroy() {
      config.onDestroy?.()
    },
  })
}

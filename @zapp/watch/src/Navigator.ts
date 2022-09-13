import { NavigatorInterface, RegisteredCallback, WorkingTree, SavedTreeState } from '@zapp/core'

export interface NavigatorData {
  currentPage: string
  navStack: string[]
  savedStates: SavedTreeState[]
  registeredCallbacks: RegisteredCallback[]
  shouldRestore: boolean
}

export class Navigator implements NavigatorInterface {
  get currentPage(): string {
    return getApp()._options.globalData._navigator.currentPage
  }

  private get data(): NavigatorData {
    return getApp()._options.globalData._navigator
  }

  public navigate(page: string, params?: Record<string, unknown>) {
    this.data.navStack.push(this.data.currentPage)
    this.data.currentPage = page
    this.data.savedStates.push(WorkingTree.saveState())

    hmApp.gotoPage({ url: page, param: JSON.stringify(params ?? {}) })
  }

  public goBack() {
    this.data.currentPage = this.data.navStack.pop()!
    this.data.shouldRestore = true

    hmApp.goBack()
  }

  public goHome() {
    hmApp.gotoHome()
  }

  public registerResultCallback(page: string, path: string[]): void {
    this.data.registeredCallbacks.push({
      targetPage: page,
      callbackPath: path,
      ready: false,
    })
  }

  public tryPoppingLauncherResult(page: string, path: string[]): RegisteredCallback | undefined {
    if (this.data.registeredCallbacks.length > 0) {
      const top = this.data.registeredCallbacks[this.data.registeredCallbacks.length - 1]

      if (top.ready && page === top.targetPage && top.callbackPath.length === path.length) {
        for (let i = 0; i < path.length; i++) {
          if (path[i] !== top.callbackPath[i]) {
            return undefined
          }
        }

        return this.data.registeredCallbacks.pop()
      }
    }

    return undefined
  }

  public finishWithResult(params: Record<string, unknown>): void {
    if (this.data.registeredCallbacks.length > 0) {
      const top = this.data.registeredCallbacks[this.data.registeredCallbacks.length - 1]

      if (top.targetPage === this.currentPage) {
        top.ready = true
        top.result = params
      }
    }

    this.goBack()
  }
}

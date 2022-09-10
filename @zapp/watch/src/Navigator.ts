import { NavigatorInterface, RegisteredCallback, WorkingTree } from '@zapp/core'

export class Navigator implements NavigatorInterface {
  get currentPage(): string {
    return getApp()._options.globalData._navigator.currentPage
  }

  public navigate(page: string, params: Record<string, unknown>) {
    const navigatorData = getApp()._options.globalData._navigator
    navigatorData.stack.push(navigatorData.currentPage)
    navigatorData.currentPage = page
    navigatorData.savedStates.push(WorkingTree.saveState())

    hmApp.gotoPage({ url: page, param: JSON.stringify(params) })
  }

  public goBack() {
    const navigatorData = getApp()._options.globalData._navigator
    navigatorData.currentPage = navigatorData.stack.pop()
    navigatorData.shouldRestore = true

    hmApp.goBack()
  }

  registerResultCallback(page: string, path: string[]): void {
    throw new Error('Method not implemented.')
  }

  tryPoppingLauncherResult(page: string, path: string[]): RegisteredCallback | undefined {
    throw new Error('Method not implemented.')
  }

  finishWithResult(params: Record<string, unknown>): void {
    throw new Error('Method not implemented.')
  }
}

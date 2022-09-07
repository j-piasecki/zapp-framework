import { NavigatorInterface, RegisteredCallback } from '@zapp/core'

export class Navigator implements NavigatorInterface {
  get currentPage(): string {
    throw new Error('Method not implemented.')
  }

  public navigate(page: string, params: Record<string, unknown>) {
    hmApp.gotoPage({ url: page, param: JSON.stringify(params) })
  }

  public goBack() {
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

import { NavigatorInterface } from '@zapp/core'

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
}

import { NavigatorInterface } from '@zapp/core'

export class Navigator implements NavigatorInterface {
  public navigate(page: string, params: Record<string, unknown>) {
    hmApp.gotoPage({ url: page, param: JSON.stringify(params) })
  }

  public goBack() {
    hmApp.goBack()
  }
}

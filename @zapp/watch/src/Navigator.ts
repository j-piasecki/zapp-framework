export abstract class Navigator {
  public static navigate(page: string, params: Record<string, unknown>) {
    hmApp.gotoPage({ url: page, param: JSON.stringify(params) })
  }

  public static goBack() {
    hmApp.goBack()
  }
}

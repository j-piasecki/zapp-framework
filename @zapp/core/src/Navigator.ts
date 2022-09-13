export interface RegisteredCallback {
  targetPage: string
  callbackPath: string[]
  result?: Record<string, unknown>
  ready: boolean
}

export interface NavigatorInterface {
  readonly currentPage: string
  navigate(route: string, params?: Record<string, unknown>): void
  goBack(): void
  goHome(): void
  registerResultCallback(page: string, path: string[]): void
  tryPoppingLauncherResult(page: string, path: string[]): RegisteredCallback | undefined
  finishWithResult(params: Record<string, unknown>): void
}

let navigator: NavigatorInterface

export abstract class Navigator {
  public static get currentPage(): string {
    return navigator.currentPage
  }

  public static navigate(route: string, params?: Record<string, unknown>): void {
    navigator.navigate(route, params)
  }

  public static goBack(): void {
    navigator.goBack()
  }

  public static goHome(): void {
    navigator.goHome()
  }

  public static registerResultCallback(page: string, path: string[]) {
    navigator.registerResultCallback(page, path)
  }

  public static tryPoppingLauncherResult(page: string, path: string[]): RegisteredCallback | undefined {
    return navigator.tryPoppingLauncherResult(page, path)
  }

  public static finishWithResult(params: Record<string, unknown>) {
    navigator.finishWithResult(params)
  }
}

export function setNavigator(navigatorInstance: NavigatorInterface): void {
  navigator = navigatorInstance
}

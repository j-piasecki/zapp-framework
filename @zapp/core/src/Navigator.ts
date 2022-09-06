export interface NavigatorInterface {
  navigate(route: string, params?: Record<string, unknown>): void
  goBack(): void
}

let navigator: NavigatorInterface

export abstract class Navigator {
  public static navigate(route: string, params?: Record<string, unknown>): void {
    navigator.navigate(route, params)
  }

  public static goBack(): void {
    navigator.goBack()
  }
}

export function setNavigator(navigatorInstance: NavigatorInterface): void {
  navigator = navigatorInstance
}

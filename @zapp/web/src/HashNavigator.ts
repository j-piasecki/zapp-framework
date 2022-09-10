import { SavedTreeState, WorkingTree, NavigatorInterface, RegisteredCallback } from '@zapp/core'

const historyStack: SavedTreeState[] = []
const registeredCallbacks: RegisteredCallback[] = []

// not using common interface for now due to platform specific differences
export class HashNavigator implements NavigatorInterface {
  private routes: Record<string, (params?: Record<string, unknown>) => void>
  private currentRoute: string

  public register(startingRoute: string, routes: Record<string, (params?: Record<string, unknown>) => void>) {
    const routeToRender = window.location.hash.length === 0 ? startingRoute : window.location.hash.substring(1)

    this.routes = routes
    this.changeRoute(routeToRender)
    history.replaceState(undefined, '', `#${routeToRender}`)

    window.addEventListener('popstate', (e) => {
      WorkingTree.restoreState(historyStack.pop()!)
      this.changeRoute(window.location.hash.substring(1), e.state)
    })
  }

  public navigate(route: string, params?: Record<string, unknown>) {
    if (this.currentRoute !== route && this.routes[route] !== undefined) {
      historyStack.push(WorkingTree.saveState())
      this.changeRoute(route, params)
      history.pushState(params, '', `#${route}`)
    }
  }

  public goBack(): void {
    history.back()
  }

  public registerResultCallback(page: string, path: string[]): void {
    registeredCallbacks.push({
      targetPage: page,
      callbackPath: path,
      ready: false,
    })
  }

  public tryPoppingLauncherResult(page: string, path: string[]): RegisteredCallback | undefined {
    if (registeredCallbacks.length > 0) {
      const top = registeredCallbacks[registeredCallbacks.length - 1]

      if (top.ready && page === top.targetPage && top.callbackPath.length === path.length) {
        for (let i = 0; i < path.length; i++) {
          if (path[i] !== top.callbackPath[i]) {
            return undefined
          }
        }

        return registeredCallbacks.pop()
      }
    }

    return undefined
  }

  public finishWithResult(params: Record<string, unknown>): void {
    if (registeredCallbacks.length > 0) {
      const top = registeredCallbacks[registeredCallbacks.length - 1]

      if (top.targetPage === this.currentPage) {
        top.ready = true
        top.result = params
      }
    }

    this.goBack()
  }

  private changeRoute(route: string, params?: Record<string, unknown>) {
    this.currentRoute = route
    WorkingTree.dropAll()
    this.routes[route](params)
  }

  public get currentPage(): string {
    return this.currentRoute
  }
}

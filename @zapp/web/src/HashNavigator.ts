import { SavedTreeState, WorkingTree, NavigatorInterface } from '@zapp/core'

const historyStack: SavedTreeState[] = []

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

  private changeRoute(route: string, params?: Record<string, unknown>) {
    this.currentRoute = route
    WorkingTree.dropAll()
    this.routes[route](params)
  }

  public get currentPage(): string {
    return this.currentRoute
  }
}

import { SavedTreeState, WorkingTree } from '@zapp/core'

const historyStack: SavedTreeState[] = []

// not using common interface for now due to platform specific differences
export abstract class HashNavigator {
  private static routes: Record<string, (params?: Record<string, unknown>) => void>
  private static _currentRoute: string

  public static register(startingRoute: string, routes: Record<string, (params?: Record<string, unknown>) => void>) {
    const routeToRender = window.location.hash.length === 0 ? startingRoute : window.location.hash.substring(1)

    HashNavigator.routes = routes
    HashNavigator.changeRoute(routeToRender)
    history.replaceState(undefined, '', `#${routeToRender}`)

    window.addEventListener('popstate', (e) => {
      WorkingTree.restoreState(historyStack.pop()!)
      HashNavigator.changeRoute(window.location.hash.substring(1), e.state)
    })
  }

  public static navigate(route: string, params?: Record<string, unknown>) {
    if (HashNavigator._currentRoute !== route && HashNavigator.routes[route] !== undefined) {
      historyStack.push(WorkingTree.saveState())
      HashNavigator.changeRoute(route, params)
      history.pushState(params, '', `#${route}`)
    }
  }

  private static changeRoute(route: string, params?: Record<string, unknown>) {
    HashNavigator._currentRoute = route
    WorkingTree.dropAll()
    HashNavigator.routes[route](params)
  }

  public static get currentRoute(): string {
    return HashNavigator._currentRoute
  }
}

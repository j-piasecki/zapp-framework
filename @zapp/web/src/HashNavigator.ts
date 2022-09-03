import { WorkingTree } from '@zapp/core'

export abstract class HashNavigator {
  private static routes: Record<string, (params?: Record<string, unknown>) => void>
  private static _currentRoute: string

  public static register(startingRoute: string, routes: Record<string, (params?: Record<string, unknown>) => void>) {
    HashNavigator.routes = routes
    HashNavigator.changeRoute(startingRoute)
    history.replaceState(undefined, '', `#${startingRoute}`)

    window.addEventListener('popstate', (e) => {
      HashNavigator.changeRoute(window.location.hash.substring(1), e.state)
    })
  }

  public static navigate(route: string, params?: Record<string, unknown>) {
    if (HashNavigator._currentRoute !== route && HashNavigator.routes[route] !== undefined) {
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

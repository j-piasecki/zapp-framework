import { __setViewManager, __setZappInterface, __setNavigator } from '@zapp/core'
import { WebViewManager } from './WebViewManager.js'
import { ZappWeb } from './ZappWeb.js'
import { HashNavigator } from './HashNavigator.js'

const navigator = new HashNavigator()

__setZappInterface(new ZappWeb())
__setViewManager(new WebViewManager())
__setNavigator(navigator)

export function registerNavigationRoutes(
  startingRoute: string,
  routes: Record<string, (params?: Record<string, unknown>) => void>
) {
  navigator.register(startingRoute, routes)
}

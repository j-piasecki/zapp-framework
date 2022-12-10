import {
  __setViewManager,
  __setZappInterface,
  __setNavigator,
  __setApplicationImplementation,
} from '@zapp-framework/core'
import { WebViewManager } from './WebViewManager.js'
import { ZappWeb } from './ZappWeb.js'
import { HashNavigator } from './HashNavigator.js'
import { Application } from './Application.js'

export { rememberScrollPosition } from './rememberScrollPosition.js'

const navigator = new HashNavigator()

__setZappInterface(new ZappWeb())
__setViewManager(new WebViewManager())
__setNavigator(navigator)
__setApplicationImplementation(Application)

export function registerNavigationRoutes(
  startingRoute: string,
  routes: Record<string, (params?: Record<string, unknown>) => void>
) {
  navigator.register(startingRoute, routes)
}

// @ts-ignore
window.px = (x: number) => x

import { __setViewManager, __setZappInterface } from '@zapp/core'
import { WebViewManager } from './WebViewManager.js'
import { ZappWeb } from './ZappWeb.js'

export { HashNavigator } from './HashNavigator.js'

__setZappInterface(new ZappWeb())
__setViewManager(new WebViewManager())

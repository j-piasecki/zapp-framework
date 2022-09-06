import { setViewManager, setZappInterface } from '@zapp/core'
import { WebViewManager } from './WebViewManager.js'
import { ZappWeb } from './ZappWeb.js'

export { HashNavigator } from './HashNavigator.js'

setViewManager(new WebViewManager())

setZappInterface(new ZappWeb())

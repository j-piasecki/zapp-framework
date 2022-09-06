import { EventManager, setViewManager, setZappInterface } from '@zapp/core'
import { WatchViewManager } from './WatchViewManager.js'
import { ZappWatch } from './ZappWatch.js'
export { ActivityIndicator } from './ActivityIndicator.js'

EventManager.fillLeaveEnterEvents()

setZappInterface(new ZappWatch())
setViewManager(new WatchViewManager())

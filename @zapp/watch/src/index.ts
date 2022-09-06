import { EventManager, __setViewManager, __setZappInterface } from '@zapp/core'
import { WatchViewManager } from './WatchViewManager.js'
import { ZappWatch } from './ZappWatch.js'
export { ActivityIndicator } from './ActivityIndicator.js'

EventManager.fillLeaveEnterEvents()

__setZappInterface(new ZappWatch())
__setViewManager(new WatchViewManager())

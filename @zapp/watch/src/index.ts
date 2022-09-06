import { EventManager, __setViewManager, __setZappInterface, __setSimpleScreenImplementation } from '@zapp/core'
import { WatchViewManager } from './WatchViewManager.js'
import { ZappWatch } from './ZappWatch.js'
import { Screen } from './Screen.js'
export { ActivityIndicator } from './ActivityIndicator.js'

EventManager.fillLeaveEnterEvents()

__setZappInterface(new ZappWatch())
__setViewManager(new WatchViewManager())
__setSimpleScreenImplementation(Screen)

import {
  EventManager,
  __setViewManager,
  __setZappInterface,
  __setSimpleScreenImplementation,
  __setNavigator,
} from '@zapp/core'
import { WatchViewManager } from './WatchViewManager.js'
import { ZappWatch } from './ZappWatch.js'
import { Screen } from './Screen.js'
import { Navigator } from './Navigator.js'
export { ActivityIndicator } from './ActivityIndicator.js'

EventManager.fillLeaveEnterEvents()

__setZappInterface(new ZappWatch())
__setViewManager(new WatchViewManager())
__setSimpleScreenImplementation(Screen)
__setNavigator(new Navigator())

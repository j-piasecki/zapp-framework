import {
  PointerEventManager,
  __setViewManager,
  __setZappInterface,
  __setSimpleScreenImplementation,
  __setNavigator,
  __setApplicationImplementation,
} from '@zapp/core'
import { WatchViewManager } from './WatchViewManager.js'
import { ZappWatch } from './ZappWatch.js'
import { SimpleScreen } from './SimpleScreen.js'
import { Navigator } from './Navigator.js'
import { Application } from './Application.js'

PointerEventManager.fillLeaveEnterEvents()

__setZappInterface(new ZappWatch())
__setViewManager(new WatchViewManager())
__setSimpleScreenImplementation(SimpleScreen)
__setNavigator(new Navigator())
__setApplicationImplementation(Application)

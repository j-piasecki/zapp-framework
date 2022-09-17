import {
  PointerEventManager,
  __setViewManager,
  __setZappInterface,
  __setSimpleScreenImplementation,
  __setNavigator,
  __setApplicationImplementation,
} from '@zapp/core'
import { viewManagerInstance } from './WatchViewManager.js'
import { ZappWatch } from './ZappWatch.js'
import { SimpleScreen } from './SimpleScreen.js'
import { Navigator } from './Navigator.js'
import { Application } from './Application.js'

export {
  ScreenPager,
  ScreenPagerConfigBuilder,
  ScreenPagerConfig,
  rememberCurrentPage,
  Direction,
} from './ScreenPager.js'

PointerEventManager.fillLeaveEnterEvents()

__setZappInterface(new ZappWatch())
__setViewManager(viewManagerInstance)
__setSimpleScreenImplementation(SimpleScreen)
__setNavigator(new Navigator())
__setApplicationImplementation(Application)

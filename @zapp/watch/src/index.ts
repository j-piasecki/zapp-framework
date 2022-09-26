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
import { SimpleScreen } from './screens/SimpleScreen.js'
import { Navigator } from './Navigator.js'
import { Application } from './Application.js'

export { Direction } from './types.js'
export {
  ScreenPager,
  PagerEntry,
  ScreenPagerConfigBuilder,
  ScreenPagerConfig,
  rememberCurrentPage,
} from './screens/ScreenPager.js'
export { ScrollableScreen, rememberScrollPosition } from './screens/ScrollableScreen.js'
export { rememberSaveable } from './KeyValueStorage.js'

PointerEventManager.fillLeaveEnterEvents()

__setZappInterface(new ZappWatch())
__setViewManager(viewManagerInstance)
__setSimpleScreenImplementation(SimpleScreen)
__setNavigator(new Navigator())
__setApplicationImplementation(Application)

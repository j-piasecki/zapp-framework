import {
  Config,
  ConfigBuilder,
  ConfigType,
  Stack,
  RememberedMutableValue,
  rememberObservable,
  ScreenBody,
  sideEffect,
  PointerEventManager,
  BaseConfigBuilder,
} from '@zapp-framework/core'
import { PageWrapper } from './PageWrapper.js'
import { viewManagerInstance } from './../WatchViewManager.js'
import { Direction } from './../types.js'
import { navigatorInstance } from '../Navigator.js'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = hmSetting.getDeviceInfo()

let rememberedValues: RememberedMutableValue<number>[] = []
let nextPageNumber = 0
let currentDirection: Direction
let previousPage = 0

interface ScreenPagerConfigType extends ConfigType {
  direction: Direction
  startingPage: number
  numberOfPages: number
}

export class ScreenPagerConfigBuilder extends ConfigBuilder {
  protected config: ScreenPagerConfigType

  constructor(id: string, numberOfPages: number) {
    super(id)
    this.config.direction = Direction.Horizontal
    this.config.startingPage = 0
    this.config.numberOfPages = numberOfPages
  }

  startingPage(page: number) {
    this.config.startingPage = page
    return this
  }

  direction(direction: Direction) {
    this.config.direction = direction
    return this
  }

  build(): ScreenPagerConfigType {
    return this.config
  }
}

export function ScreenPagerConfig(id: string, numberOfPages: number) {
  return new ScreenPagerConfigBuilder(id, numberOfPages)
}

export function ScreenPager(
  configBuilder: ScreenPagerConfigBuilder,
  body: (params: Record<string, unknown>) => void
) {
  const config = configBuilder.build()

  PageWrapper({
    build: (params) => {
      Stack(Config('#pagerOpenStartingPage'), () => {
        sideEffect((restoring) => {
          if (!restoring) {
            hmUI.scrollToPage(config.startingPage, false)
          }
        })
      })

      nextPageNumber = 0
      currentDirection = config.direction

      body(params)
    },
    initialize: () => {
      hmUI.setScrollView(
        true,
        config.direction === Direction.Horizontal ? DEVICE_WIDTH : DEVICE_HEIGHT,
        config.numberOfPages,
        config.direction === Direction.Vertical
      )

      viewManagerInstance.setPageScrolling(config.direction)
    },
    destroy: () => {
      // need to scroll to the first page, otherwise navigation may break and blank screen will be shown
      hmUI.scrollToPage(0, false)
      rememberedValues = []
    },
    restoreState: (page: number) => {
      hmUI.scrollToPage(page, false)
    },
  })
}

export function PagerEntry(configBuilder: BaseConfigBuilder, body: () => void) {
  ScreenBody(
    configBuilder.offset(
      currentDirection === Direction.Horizontal ? DEVICE_WIDTH * nextPageNumber : 0,
      currentDirection === Direction.Vertical ? DEVICE_HEIGHT * nextPageNumber : 0
    ),
    () => {
      body()
    }
  )
  nextPageNumber++
}

export function tryUpdatingRememberedPagePositions() {
  const currentPage = hmUI.getScrollCurrentPage() - 1
  if (previousPage !== currentPage) {
    navigatorInstance.saveScreenState(currentPage)
    PointerEventManager.cancelPointers()
  }

  let needsClear = false
  for (const val of rememberedValues) {
    val.value = currentPage

    // @ts-ignore that's private in the core package
    needsClear = needsClear || val.context.isDropped
  }

  if (needsClear) {
    // @ts-ignore that's private in the core package
    rememberedValues = rememberedValues.filter((v) => !v.context.isDropped)
  }

  previousPage = currentPage
}

export function rememberCurrentPage(): RememberedMutableValue<number> {
  // for whatever reason, getScrollCurrentPage starts counting from 1 but scrollToPage starts from 0
  const value = rememberObservable(hmUI.getScrollCurrentPage() - 1, (prev, current) => {
    hmUI.scrollToPage(current, true)
  })

  if (rememberedValues.indexOf(value) === -1) {
    rememberedValues.push(value)
  }
  return value
}

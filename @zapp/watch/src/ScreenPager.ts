import {
  Config,
  ConfigBuilder,
  ConfigType,
  Custom,
  RememberedMutableValue,
  rememberObservable,
  ScreenBody,
  sideEffect,
} from '@zapp/core'
import { PageWrapper } from './PageWrapper'
import { viewManagerInstance } from './WatchViewManager'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = hmSetting.getDeviceInfo()

export enum Direction {
  Vertical,
  Horizontal,
}

let rememberedPage: RememberedMutableValue<number> | undefined = undefined
let rememberedValues: RememberedMutableValue<number>[] = []

interface ScreenPagerConfigType extends ConfigType {
  direction: Direction
  startingPage: number
}

export class ScreenPagerConfigBuilder extends ConfigBuilder {
  protected config: ScreenPagerConfigType

  constructor(id: string) {
    super(id)
    this.config.direction = Direction.Horizontal
    this.config.startingPage = 0
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

export function ScreenPagerConfig(id: string) {
  return new ScreenPagerConfigBuilder(id)
}

export function ScreenPager(
  configBuilder: ScreenPagerConfigBuilder,
  pages: ((params: Record<string, unknown>) => void)[]
) {
  const config = configBuilder.build()

  PageWrapper({
    build: (params) => {
      Custom(Config('pagerSavedPage'), {}, () => {
        sideEffect((restoring) => {
          if (!restoring) {
            hmUI.scrollToPage(config.startingPage, false)
          }
        })
        rememberedPage = rememberObservable(config.startingPage, undefined, (restored) => {
          // for whatever reason, getScrollCurrentPage starts counting from 1 but scrollToPage starts from 0
          hmUI.scrollToPage(restored, false)
        })
      })

      for (let i = 0; i < pages.length; i++) {
        ScreenBody(
          Config(`${config.id}#page${i}`).offset(
            config.direction === Direction.Horizontal ? DEVICE_WIDTH * i : 0,
            config.direction === Direction.Vertical ? DEVICE_HEIGHT * i : 0
          ),
          () => {
            pages[i](params)
          }
        )
      }
    },
    initialize: () => {
      hmUI.setScrollView(
        true,
        config.direction === Direction.Horizontal ? DEVICE_WIDTH : DEVICE_HEIGHT,
        pages.length,
        config.direction === Direction.Vertical
      )

      viewManagerInstance.pageScrollingEnabled = true
      viewManagerInstance.pageScrollingDirection = config.direction
    },
    destroy: () => {
      rememberedPage = undefined
      rememberedValues = []
    },
  })
}

export function tryUpdatingRememberedPagePositions() {
  const currentPage = hmUI.getScrollCurrentPage() - 1

  if (rememberedPage !== undefined) {
    rememberedPage.value = currentPage
  }

  for (const val of rememberedValues) {
    val.value = currentPage
  }
}

export function rememberCurrentPage(): RememberedMutableValue<number> {
  const value = rememberObservable(hmUI.getScrollCurrentPage() - 1, (prev, current) => {
    hmUI.scrollToPage(current, true)
  })

  rememberedValues.push(value)
  return value
}

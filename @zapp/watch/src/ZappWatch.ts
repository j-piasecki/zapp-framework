import {
  ZappInterface,
  Platform,
  WorkingTree,
  PointerEventManager,
  Renderer,
  Animation,
  GlobalEventManager,
} from '@zapp/core'
import { tryUpdatingRememberedPagePositions } from './screens/ScreenPager.js'
import { tryUpdatingRememberedScrollPositions } from './screens/ScrollableScreen.js'

export class ZappWatch extends ZappInterface {
  private timerRef: unknown

  public startLoop(): void {
    WorkingTree.requestUpdate()

    // @ts-ignore timer is in global scope on the watch
    this.timerRef = timer.createTimer(0, 16, this.update)
  }

  public stopLoop() {
    // @ts-ignore timer is in global scope on the watch
    timer.stopTimer(this.timerRef)
  }

  private update() {
    tryUpdatingRememberedPagePositions()
    tryUpdatingRememberedScrollPositions()

    PointerEventManager.processEvents()
    GlobalEventManager.tick()
    Animation.nextFrame(Date.now())

    if (WorkingTree.hasUpdates()) {
      WorkingTree.performUpdate()
      Renderer.commit(WorkingTree.root)
      Renderer.render()
    }
  }

  setValue(key: string, value: unknown): void {
    getApp()._options.globalData[key] = value
  }

  getValue(key: string): unknown {
    const app = getApp()
    if (app !== undefined) {
      return app._options.globalData[key]
    }
  }

  get platform() {
    return Platform.Watch
  }
}

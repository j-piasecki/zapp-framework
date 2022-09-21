import { ZappInterface, WorkingTree, PointerEventManager, Renderer, Animation, GlobalEventManager } from '@zapp/core'
import { tryUpdatingRememberedPagePositions } from './ScreenPager.js'
import { tryUpdatingRememberedScrollPositions } from './ScrollableScreen.js'

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
}

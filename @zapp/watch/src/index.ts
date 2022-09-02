import { EventManager, Renderer, setViewManager, WorkingTree, Animation } from '@zapp/core'
import { WatchViewManager } from './WatchViewManager.js'

setViewManager(new WatchViewManager())

export abstract class ZappWatch {
  private static timerRef: unknown

  public static init() {
    WorkingTree.requestUpdate()

    // @ts-ignore timer is in global scope on the watch
    this.timerRef = timer.createTimer(0, 16, ZappWatch.update)
  }

  public static destroy() {
    // @ts-ignore timer is in global scope on the watch
    timer.stopTimer(this.timerRef)
  }

  private static update() {
    EventManager.processEvents()
    Animation.nextFrame(Date.now())

    if (WorkingTree.hasUpdates()) {
      WorkingTree.performUpdate()
      Renderer.commit(WorkingTree.root)
      Renderer.render()
    }
  }
}

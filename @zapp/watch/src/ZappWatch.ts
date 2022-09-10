import { ZappInterface, WorkingTree, PointerEventManager, Renderer, Animation } from '@zapp/core'

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
    PointerEventManager.processEvents()
    Animation.nextFrame(Date.now())

    if (WorkingTree.hasUpdates()) {
      WorkingTree.performUpdate()
      Renderer.commit(WorkingTree.root)
      Renderer.render()
    }
  }
}

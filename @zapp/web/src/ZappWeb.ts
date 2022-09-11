import { PointerEventManager, Renderer, WorkingTree, ZappInterface, Animation, GlobalEventManager } from '@zapp/core'

export class ZappWeb extends ZappInterface {
  private running = false
  private crownDelta = 0
  private previousCrownDelta = 0
  private crownResetTimeout = -1

  public startLoop() {
    this.running = true
    WorkingTree.requestUpdate()
    requestAnimationFrame(this.update)

    window.addEventListener('wheel', (e) => {
      this.crownDelta += e.deltaY / 10

      clearTimeout(this.crownResetTimeout)
      setTimeout(() => {
        this.crownDelta = 0
      }, 100)
    })
  }

  stopLoop(): void {
    this.running = false
  }

  private update = () => {
    if (this.crownDelta !== this.previousCrownDelta) {
      this.previousCrownDelta = this.crownDelta
      GlobalEventManager.dispatchCrownEvent(this.crownDelta)
    }

    PointerEventManager.processEvents()
    Animation.nextFrame(Date.now())

    if (WorkingTree.hasUpdates()) {
      WorkingTree.performUpdate()
      Renderer.commit(WorkingTree.root)
      Renderer.render()
    }

    if (this.running) {
      requestAnimationFrame(this.update)
    }
  }
}

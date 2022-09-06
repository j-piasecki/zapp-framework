import { EventManager, Renderer, WorkingTree, ZappInterface, Animation } from '@zapp/core'

export class ZappWeb extends ZappInterface {
  private running = false

  public startLoop() {
    this.running = true
    WorkingTree.requestUpdate()
    requestAnimationFrame(this.update)
  }

  stopLoop(): void {
    this.running = false
  }

  private update = () => {
    EventManager.processEvents()
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

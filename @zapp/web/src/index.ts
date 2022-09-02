import { EventManager, Renderer, setViewManager, WorkingTree, Animation } from '@zapp/core'
import { WebViewManager } from './WebViewManager.js'

export { HashNavigator } from './HashNavigator.js'

setViewManager(new WebViewManager())

export abstract class ZappWeb {
  public static init() {
    WorkingTree.requestUpdate()
    requestAnimationFrame(ZappWeb.update)
  }

  private static update() {
    EventManager.processEvents()
    Animation.nextFrame(Date.now())

    if (WorkingTree.hasUpdates()) {
      WorkingTree.performUpdate()
      Renderer.commit(WorkingTree.root)
      Renderer.render()
    }

    requestAnimationFrame(ZappWeb.update)
  }
}

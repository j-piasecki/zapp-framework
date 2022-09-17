import { RenderNode } from './Renderer.js'
import { ViewManager } from './ViewManager.js'

export class DummyViewManager extends ViewManager {
  private nextViewId = 0

  get screenWidth() {
    return 400
  }

  get screenHeight() {
    return 400
  }

  public createView(node: RenderNode) {
    console.log('create', node.id)

    return this.nextViewId++
  }

  public dropView(node: RenderNode) {
    console.log('drop', node.id)
  }

  public updateView(previous: RenderNode, next: RenderNode) {
    console.log('update', next.id)
  }

  public getScrollOffset(): { x: number; y: number } {
    return { x: 0, y: 0 }
  }

  public measureText(
    text: string,
    _node: RenderNode,
    _availableWidth: number,
    _availableHeight: number
  ): { width: number; height: number } {
    return {
      width: text.length,
      height: 1,
    }
  }

  public isRTL(): boolean {
    return false
  }
}

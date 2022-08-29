import { ConfigType } from '../working_tree/props/Config.js'
import { RenderNode } from './Renderer.js'
import { ViewManager } from './ViewManager.js'

export class DummyViewManager extends ViewManager {
  get screenWidth() {
    return 400
  }

  get screenHeight() {
    return 400
  }

  public createView(node: RenderNode) {
    console.log('create', node.id)
  }

  public dropView(node: RenderNode) {
    console.log('drop', node.id)
  }

  public updateView(previous: RenderNode, next: RenderNode) {
    console.log('update', next.id)
  }

  public measureText(text: string, config: ConfigType): { width: number; height: number } {
    return {
      width: text.length,
      height: 1,
    }
  }
}

import { ConfigType } from '../working_tree/props/Config.js'
import { Node } from './Renderer.js'

export class ViewManager {
  get screenWidth() {
    return 400
  }

  get screenHeight() {
    return 400
  }

  public createView(node: Node) {
    console.log('create', node.id)
  }

  public dropView(node: Node) {
    console.log('drop', node.id)
  }

  public updateView(previous: Node, next: Node) {
    console.log('update', next.id)
  }

  public measureText(text: string, config: ConfigType): { width: number; height: number } {
    return {
      width: text.length,
      height: 1,
    }
  }
}

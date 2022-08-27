import { Node } from './Renderer.js'

export class ViewManager {
  public createView(node: Node) {
    console.log('create', node.id)
  }

  public dropView(node: Node) {
    console.log('drop', node.id)
  }

  public updateView(previous: Node, next: Node) {
    console.log('update', next.id)
  }
}

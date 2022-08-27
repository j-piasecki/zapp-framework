import { NodeType } from '../NodeType.js'
import { ConfigType } from '../working_tree/props/Config.js'
import { ViewNode } from '../working_tree/ViewNode.js'
import { ViewManager } from './ViewManager.js'

export interface Node {
  id: string
  type: NodeType
  config: ConfigType
  children: Node[]
  view: any
  zIndex: number
}

export abstract class Renderer {
  private static nextZIndex = 0
  private static previousTree: Node | null = null
  private static newTree: Node | null = null

  private static viewManager = new ViewManager()

  public static render() {
    if (Renderer.newTree !== null) {
      if (Renderer.previousTree == null || Renderer.previousTree.id !== Renderer.newTree.id) {
        if (this.previousTree !== null) {
          Renderer.dropView(this.previousTree)
        }

        Renderer.createView(Renderer.newTree)
      } else {
        Renderer.diffNode(Renderer.previousTree, Renderer.newTree, -1)
      }

      Renderer.previousTree = Renderer.newTree
      Renderer.newTree = null
    }
  }

  public static commit(root: ViewNode) {
    Renderer.newTree = Renderer.createNode(root)
  }

  private static diffNode(previous: Node, next: Node, previousZIndex: number) {
    // TODO: better diff algorithm?

    next.view = previous.view
    next.zIndex = previous.zIndex

    // TODO: check whether this is actually a reasonable way to handle zIndex
    if (previousZIndex > next.zIndex) {
      Renderer.dropView(next)
      Renderer.createView(next)
    } else {
      Renderer.updateView(previous, next)
    }

    for (const child of next.children) {
      const oldChild = previous.children.find((item) => item.id === child.id)
      if (oldChild === undefined) {
        Renderer.createView(child)

        previousZIndex = child.zIndex
      }
    }

    for (const child of previous.children) {
      const newChild = next.children.find((item) => item.id === child.id)
      if (newChild !== undefined) {
        Renderer.diffNode(child, newChild, previousZIndex)

        previousZIndex = child.zIndex
      } else {
        Renderer.dropView(child)
      }
    }
  }

  private static createView(node: Node) {
    node.zIndex = Renderer.nextZIndex++
    Renderer.viewManager.createView(node)

    for (const child of node.children) {
      Renderer.createView(child)
    }
  }

  private static dropView(node: Node) {
    Renderer.viewManager.dropView(node)

    for (const child of node.children) {
      Renderer.dropView(child)
    }
  }

  private static updateView(previous: Node, next: Node) {
    Renderer.viewManager.updateView(previous, next)
  }

  private static createNode(node: ViewNode): Node {
    const result: Node = {
      id: node.id,
      type: node.type,
      config: node.config,
      children: [],
      view: -1,
      zIndex: -1,
    }

    for (const child of node.children) {
      if (child instanceof ViewNode) {
        result.children.push(Renderer.createNode(child))
      }
    }

    return result
  }
}

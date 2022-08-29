import { NodeType } from '../NodeType.js'
import { ConfigType } from '../working_tree/props/Config.js'
import { ViewNode } from '../working_tree/ViewNode.js'
import { LayoutManager } from './LayoutManager.js'
import { ViewManager } from './ViewManager.js'

interface Layout {
  width: number
  height: number
  x: number
  y: number
}

export interface DisplaySizeProvider {
  readonly screenWidth: number
  readonly screenHeight: number
}

export interface RenderNode {
  id: string
  type: NodeType
  config: ConfigType
  children: RenderNode[]
  view: any
  zIndex: number
  layout: Layout
}

export abstract class Renderer {
  private static nextZIndex = 0
  private static previousTree: RenderNode | null = null
  private static newTree: RenderNode | null = null

  private static viewManager: ViewManager
  private static layoutManager = new LayoutManager()

  public static setViewManager(viewManager: ViewManager) {
    Renderer.viewManager = viewManager
    Renderer.layoutManager.setDisplaySizeProvider(viewManager)
  }

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

      console.log(JSON.stringify(Renderer.newTree, null, 2))

      Renderer.previousTree = Renderer.newTree
      Renderer.newTree = null
    }
  }

  public static commit(root: ViewNode) {
    Renderer.newTree = Renderer.createNode(root)
    Renderer.layoutManager.calculateLayout(Renderer.newTree)
  }

  private static diffNode(previous: RenderNode, next: RenderNode, previousZIndex: number): number {
    // TODO: better diff algorithm?

    next.view = previous.view
    next.zIndex = previous.zIndex

    // TODO: check whether this is actually a reasonable way to handle zIndex
    // general idea is that z-index should increase when performing depth-first traversal of the tree
    // if the z-index is not increased, the view will be dropped and recreated, moving it to the top
    // TODO: handle layout-only views that don't need to have a view suddenly becoming visible
    if (previousZIndex > next.zIndex) {
      Renderer.dropView(next)
      Renderer.createView(next)
    } else {
      Renderer.updateView(previous, next)
    }

    previousZIndex = next.zIndex

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
        previousZIndex = Renderer.diffNode(child, newChild, previousZIndex)
      } else {
        Renderer.dropView(child)
      }
    }

    // maybe make it staic instead of passing it around?
    return previousZIndex
  }

  private static createView(node: RenderNode) {
    // TODO: handle layout-only views that don't need to have a view
    node.zIndex = Renderer.nextZIndex++
    Renderer.viewManager.createView(node)

    for (const child of node.children) {
      Renderer.createView(child)
    }
  }

  private static dropView(node: RenderNode) {
    Renderer.viewManager.dropView(node)

    for (const child of node.children) {
      Renderer.dropView(child)
    }
  }

  private static shouldUpdateView(previous: RenderNode, next: RenderNode): boolean {
    // TODO: check if the config changed in a meaningful way before updating
    return true
  }

  private static updateView(previous: RenderNode, next: RenderNode) {
    if (Renderer.shouldUpdateView(previous, next)) {
      Renderer.viewManager.updateView(previous, next)
    }
  }

  private static createNode(node: ViewNode): RenderNode {
    const result: RenderNode = {
      id: node.id,
      type: node.type,
      config: node.config,
      children: [],
      view: -1,
      zIndex: -1,
      layout: Renderer.createLayout(),
    }

    for (const child of node.children) {
      if (child instanceof ViewNode) {
        result.children.push(Renderer.createNode(child))
      }
    }

    return result
  }

  private static createLayout(): Layout {
    return {
      width: -1,
      height: -1,
      x: 0,
      y: 0,
    }
  }
}

export function setViewManager(viewManager: ViewManager) {
  Renderer.setViewManager(viewManager)
}

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

interface RenderConfig extends ConfigType {
  isInherited: Map<string, boolean>
}

export interface RenderNode {
  id: string
  type: NodeType
  config: RenderConfig
  children: RenderNode[]
  view: unknown
  zIndex: number
  layout: Layout
}

export abstract class Renderer {
  private static nextZIndex = 0
  private static currentTree: RenderNode | null = null
  private static newTree: RenderNode | null = null

  private static viewManager: ViewManager
  private static layoutManager = new LayoutManager()

  public static setViewManager(viewManager: ViewManager) {
    Renderer.viewManager = viewManager
    Renderer.layoutManager.setViewManager(viewManager)
  }

  public static render() {
    if (Renderer.newTree !== null) {
      Renderer.layoutManager.calculateLayout(Renderer.newTree)

      if (Renderer.currentTree == null || Renderer.currentTree.id !== Renderer.newTree.id) {
        if (this.currentTree !== null) {
          Renderer.dropView(this.currentTree)
        }

        Renderer.createView(Renderer.newTree)
      } else {
        Renderer.diffNode(Renderer.currentTree, Renderer.newTree, -1)
      }

      Renderer.currentTree = Renderer.newTree
      Renderer.newTree = null
    }
  }

  public static commit(root: ViewNode) {
    Renderer.newTree = Renderer.createNode(root)
  }

  private static diffNode(previous: RenderNode, next: RenderNode, previousZIndex: number): number {
    // TODO: better diff algorithm?

    next.view = previous.view
    next.zIndex = previous.zIndex

    // if the view is null, it means that the node was layout-only previous frame but its config
    // has changed and it's going to be visible now, we need to create a view in this case
    if (next.view === null && !Renderer.isNodeLayoutOnly(next)) {
      next.zIndex = Renderer.nextZIndex++
      next.view = Renderer.viewManager.createView(next)
    } else if (next.view !== null && Renderer.isNodeLayoutOnly(next)) {
      // when the view is not null but the node is layout-only, we need to drop the view as
      // it's not going to be visible anymore
      Renderer.viewManager.dropView(next)
      next.view = null
      next.zIndex = -1
    } else if (next.view !== null) {
      // otherwise we check if the view exists before recreating, or updating it

      // TODO: check whether this is actually a reasonable way to handle zIndex
      // general idea is that z-index should increase when performing depth-first traversal of the tree
      // if the z-index is not increased, the view will be dropped and recreated, moving it to the top

      if (previousZIndex > next.zIndex) {
        Renderer.dropView(next)
        Renderer.createView(next)
      } else {
        Renderer.updateView(previous, next)
      }
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
    if (!Renderer.isNodeLayoutOnly(node)) {
      node.zIndex = Renderer.nextZIndex++
      node.view = Renderer.viewManager.createView(node)
    }

    for (const child of node.children) {
      Renderer.createView(child)
    }
  }

  private static dropView(node: RenderNode) {
    Renderer.viewManager.dropView(node)
    node.view = null

    for (const child of node.children) {
      Renderer.dropView(child)
    }
  }

  private static isNodeLayoutOnly(node: RenderNode): boolean {
    return (
      node.config.background === undefined &&
      node.type !== NodeType.Text &&
      (node.config.onPointerMove === undefined || node.config.isInherited?.get('onPointerMove') === true) &&
      (node.config.onPointerDown === undefined || node.config.isInherited?.get('onPointerDown') === true) &&
      (node.config.onPointerUp === undefined || node.config.isInherited?.get('onPointerUp') === true)
    )
  }

  private static shouldUpdateView(previous: RenderNode, next: RenderNode): boolean {
    return (
      previous.layout.width !== next.layout.width ||
      previous.layout.height !== next.layout.height ||
      previous.layout.x !== next.layout.x ||
      previous.layout.y !== next.layout.y ||
      previous.config.background !== next.config.background ||
      previous.config.cornerRadius !== next.config.cornerRadius ||
      previous.config.text !== next.config.text ||
      previous.config.onPointerDown !== next.config.onPointerDown ||
      previous.config.onPointerMove !== next.config.onPointerMove ||
      previous.config.onPointerUp !== next.config.onPointerUp
    )
  }

  private static updateView(previous: RenderNode, next: RenderNode) {
    if (Renderer.shouldUpdateView(previous, next)) {
      Renderer.viewManager.updateView(previous, next)
    }
  }

  private static createNode(node: ViewNode, parent?: RenderNode): RenderNode {
    const config: RenderConfig = { ...node.config, isInherited: new Map() }

    if (node.config.onPointerDown === undefined && parent?.config.onPointerDown !== undefined) {
      config.onPointerDown = parent.config.onPointerDown
      config.isInherited.set('onPointerDown', true)
    }
    if (node.config.onPointerMove === undefined && parent?.config.onPointerMove !== undefined) {
      config.onPointerMove = parent.config.onPointerMove
      config.isInherited.set('onPointerMove', true)
    }
    if (node.config.onPointerUp === undefined && parent?.config.onPointerUp !== undefined) {
      config.onPointerUp = parent.config.onPointerUp
      config.isInherited.set('onPointerUp', true)
    }

    const result: RenderNode = {
      id: node.id,
      type: node.type,
      config: config,
      children: [],
      view: null,
      zIndex: -1,
      layout: Renderer.createLayout(),
    }

    for (const child of node.children) {
      if (child instanceof ViewNode) {
        result.children.push(Renderer.createNode(child, result))
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

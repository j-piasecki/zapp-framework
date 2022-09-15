import { NodeType } from '../NodeType.js'
import { ConfigType } from '../working_tree/props/types.js'
import { ViewNode } from '../working_tree/ViewNode.js'
import { CustomViewProps } from '../working_tree/views/Custom.js'
import { PointerEventManager } from './PointerEventManager.js'
import { LayoutManager } from './LayoutManager.js'
import { ViewManager } from './ViewManager.js'
import { EventNode } from '../working_tree/EventNode.js'
import { GlobalEventManager } from './GlobalEventManager.js'

interface Layout {
  width: number
  height: number
  x: number
  y: number
  measured: boolean
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
  customViewProps?: CustomViewProps
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

  /** @internal */
  public static getCurrentTree(): RenderNode | null {
    return Renderer.currentTree
  }

  public static get screenWidth() {
    return Renderer.viewManager.screenWidth
  }

  public static get screenHeight() {
    return Renderer.viewManager.screenHeight
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
    GlobalEventManager.clearHandlers()
    Renderer.newTree = Renderer.createNode(root)
  }

  public static hitTest(x: number, y: number, parent: RenderNode | null = Renderer.currentTree): RenderNode | null {
    // TODO: scrolling
    if (
      parent === null ||
      x < parent.layout.x ||
      x > parent.layout.x + parent.layout.width ||
      y < parent.layout.y ||
      y > parent.layout.y + parent.layout.height
    ) {
      return null
    }

    for (let i = parent.children.length - 1; i >= 0; i--) {
      const result = Renderer.hitTest(x, y, parent.children[i])

      if (result !== null) {
        return result
      }
    }

    return parent
  }

  private static diffNode(previous: RenderNode, next: RenderNode, previousZIndex: number): number {
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

      if (previousZIndex > next.zIndex || Renderer.shouldRecreateView(previous, next)) {
        Renderer.dropView(next)
        // don't create children recursively as they will be recreated when diffed, we don't need the
        // same constraint for dropping views as the `view` property on next is not yet set for children
        Renderer.createView(next, false)
      } else {
        Renderer.updateView(previous, next)
      }
    }
    previousZIndex = next.zIndex

    // keep index of the last node that was found in both trees, as nodes can only be added or removed
    // they will be in the same order in the both trees, so we can start looking from there
    let lastFoundIndex = 0
    for (let i = 0; i < next.children.length; i++) {
      const newChild = next.children[i]

      let found = false
      for (let j = lastFoundIndex; j < previous.children.length; j++) {
        const previousChild = previous.children[j]

        if (newChild.id === previousChild.id) {
          // if there node is being updated, we can drop all nodes between it and the last found node
          // as that means they are not present in the new tree
          for (let k = lastFoundIndex; k < j; k++) {
            Renderer.dropView(previous.children[k])
          }

          lastFoundIndex = j + 1
          found = true
          previousZIndex = Renderer.diffNode(previousChild, newChild, previousZIndex)
          break
        }
      }

      if (!found) {
        Renderer.createView(newChild)
        previousZIndex = newChild.zIndex
      }
    }

    // eventually drop the nodes from the end of the list that are not present in the new tree
    for (let k = lastFoundIndex; k < previous.children.length; k++) {
      Renderer.dropView(previous.children[k])
    }

    // maybe make it staic instead of passing it around?
    return previousZIndex
  }

  private static createView(node: RenderNode, createChildren = true) {
    if (!Renderer.isNodeLayoutOnly(node)) {
      node.zIndex = Renderer.nextZIndex++
      node.view = Renderer.viewManager.createView(node)
      PointerEventManager.addEventTarget(node)
    }

    if (createChildren) {
      for (const child of node.children) {
        Renderer.createView(child)
      }
    }
  }

  private static dropView(node: RenderNode) {
    if (node.view !== null) {
      PointerEventManager.dropEventTarget(node)
      Renderer.viewManager.dropView(node)
      node.view = null
    }

    for (const child of node.children) {
      Renderer.dropView(child)
    }
  }

  private static isNodeLayoutOnly(node: RenderNode): boolean {
    return (
      node.config.background === undefined &&
      node.type !== NodeType.Text &&
      node.type !== NodeType.Arc &&
      node.type !== NodeType.Custom &&
      node.type !== NodeType.Image &&
      (node.config.onPointerMove === undefined || node.config.isInherited?.get('onPointerMove') === true) &&
      (node.config.onPointerDown === undefined || node.config.isInherited?.get('onPointerDown') === true) &&
      (node.config.onPointerUp === undefined || node.config.isInherited?.get('onPointerUp') === true) &&
      (node.config.onPointerEnter === undefined || node.config.isInherited?.get('onPointerEnter') === true) &&
      (node.config.onPointerLeave === undefined || node.config.isInherited?.get('onPointerLeave') === true)
    )
  }

  private static shouldUpdateView(previous: RenderNode, next: RenderNode): boolean {
    return (
      next.type === NodeType.Custom ||
      previous.layout.width !== next.layout.width ||
      previous.layout.height !== next.layout.height ||
      previous.layout.x !== next.layout.x ||
      previous.layout.y !== next.layout.y ||
      previous.config.background !== next.config.background ||
      previous.config.cornerRadius !== next.config.cornerRadius ||
      previous.config.text !== next.config.text ||
      previous.config.borderColor !== next.config.borderColor ||
      previous.config.borderWidth !== next.config.borderWidth ||
      previous.config.lineWidth !== next.config.lineWidth ||
      previous.config.startAngle !== next.config.startAngle ||
      previous.config.endAngle !== next.config.endAngle ||
      previous.config.innerOffsetX !== next.config.innerOffsetX ||
      previous.config.innerOffsetY !== next.config.innerOffsetY ||
      previous.config.originX !== next.config.originX ||
      previous.config.originY !== next.config.originY ||
      previous.config.rotation !== next.config.rotation ||
      previous.config.onPointerDown !== next.config.onPointerDown ||
      previous.config.onPointerMove !== next.config.onPointerMove ||
      previous.config.onPointerUp !== next.config.onPointerUp ||
      previous.config.onPointerEnter !== next.config.onPointerEnter ||
      previous.config.onPointerLeave !== next.config.onPointerLeave
    )
  }

  private static shouldRecreateView(previous: RenderNode, next: RenderNode): boolean {
    // recreate view if it has a border while it didn't have one before to preserve z-index
    // as border is a separate view on the zepp os
    return (
      (previous.config.borderWidth === undefined || previous.config.borderWidth <= 0) &&
      next.config.borderWidth !== undefined &&
      next.config.borderWidth > 0
    )
  }

  private static updateView(previous: RenderNode, next: RenderNode) {
    if (Renderer.shouldUpdateView(previous, next)) {
      Renderer.viewManager.updateView(previous, next)
      PointerEventManager.addEventTarget(next)
    }
  }

  private static createNode(node: ViewNode, parent?: RenderNode): RenderNode {
    const config: RenderConfig = { ...node.config, isInherited: new Map() }

    // TODO: check whether all or nothing is the right way to handle event inheritance
    if (
      node.config.onPointerDown === undefined &&
      node.config.onPointerMove === undefined &&
      node.config.onPointerUp === undefined &&
      node.config.onPointerEnter === undefined &&
      node.config.onPointerLeave === undefined
    ) {
      if (parent?.config.onPointerDown !== undefined) {
        config.onPointerDown = parent.config.onPointerDown
        config.isInherited.set('onPointerDown', true)
      }
      if (parent?.config.onPointerMove !== undefined) {
        config.onPointerMove = parent.config.onPointerMove
        config.isInherited.set('onPointerMove', true)
      }
      if (parent?.config.onPointerUp !== undefined) {
        config.onPointerUp = parent.config.onPointerUp
        config.isInherited.set('onPointerUp', true)
      }
      if (parent?.config.onPointerEnter !== undefined) {
        config.onPointerEnter = parent.config.onPointerEnter
        config.isInherited.set('onPointerEnter', true)
      }
      if (parent?.config.onPointerLeave !== undefined) {
        config.onPointerLeave = parent.config.onPointerLeave
        config.isInherited.set('onPointerLeave', true)
      }
    }

    const result: RenderNode = {
      id: node.id,
      type: node.type,
      config: config,
      children: [],
      view: null,
      zIndex: -1,
      layout: Renderer.createLayout(),
      customViewProps: node.customViewProps,
    }

    for (const child of node.children) {
      if (child instanceof ViewNode) {
        result.children.push(Renderer.createNode(child, result))
      } else if (child instanceof EventNode) {
        GlobalEventManager.registerHandler({
          type: child.eventType,
          buttonAction: child.buttonAction,
          handler: child.handler,
        })
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
      measured: false,
    }
  }
}

export function setViewManager(viewManager: ViewManager) {
  Renderer.setViewManager(viewManager)
}

import { NodeType } from '../NodeType.js'
import { ViewNode } from '../working_tree/ViewNode.js'
import { PointerEventManager } from './PointerEventManager.js'
import { LayoutManager } from './LayoutManager.js'
import { ViewManager } from './ViewManager.js'
import { EventNode } from '../working_tree/EventNode.js'
import { GlobalEventManager } from './GlobalEventManager.js'
import { Layout, RenderedTree, RenderNode } from './RenderedTree.js'
import { RootNode } from '../working_tree/WorkingTree.js'

export abstract class Renderer {
  private static layoutManager = new LayoutManager()
  private static nextZIndex = 0

  public static render() {
    if (RenderedTree.next !== null) {
      Renderer.layoutManager.calculateLayout(RenderedTree.next)

      if (RenderedTree.current == null || RenderedTree.current.id !== RenderedTree.next.id) {
        if (RenderedTree.current !== null) {
          Renderer.dropView(RenderedTree.current)
        }

        Renderer.createView(RenderedTree.next)
      } else {
        Renderer.diffNode(RenderedTree.current, RenderedTree.next, -1)
      }

      RenderedTree.current = RenderedTree.next
      RenderedTree.next = null
    }
  }

  public static commit(root: RootNode) {
    GlobalEventManager.clearHandlers()
    RenderedTree.next = Renderer.createNode(root)
  }

  private static diffNode(previous: RenderNode, next: RenderNode, previousZIndex: number): number {
    next.view = previous.view
    next.zIndex = previous.zIndex

    // reset previousZIndex when encountering a Screen node, applies to ScreenPager where we don't
    // want to drop a bunch of screens because something changes on the first one
    if (next.type === NodeType.Screen) {
      previousZIndex = next.zIndex
    }

    // if the view is null, it means that the node was layout-only previous frame but its config
    // has changed and it's going to be visible now, we need to create a view in this case
    if (next.view === null && !Renderer.isNodeLayoutOnly(next)) {
      Renderer.createView(next, false)
    } else if (next.view !== null && Renderer.isNodeLayoutOnly(next)) {
      // when the view is not null but the node is layout-only, we need to drop the view as
      // it's not going to be visible anymore
      ViewManager.dropView(next)
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

    // only update previousZIndex when currently considered node actually renders a view
    if (next.zIndex !== -1) {
      previousZIndex = next.zIndex
    }

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
      node.view = ViewManager.createView(node)
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
      ViewManager.dropView(node)
      node.view = null
    }

    for (const child of node.children) {
      Renderer.dropView(child)
    }
  }

  private static isNodeLayoutOnly(node: RenderNode): boolean {
    return (
      node.config.background === undefined &&
      node.config.borderWidth === undefined &&
      node.type !== NodeType.Screen && // used to intercept pointer events
      node.type !== NodeType.Text &&
      node.type !== NodeType.Arc &&
      node.type !== NodeType.Custom &&
      node.type !== NodeType.Image
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
      previous.config.source !== next.config.source ||
      previous.config.onPointerDown !== next.config.onPointerDown ||
      previous.config.onPointerMove !== next.config.onPointerMove ||
      previous.config.onPointerUp !== next.config.onPointerUp ||
      previous.config.onPointerEnter !== next.config.onPointerEnter ||
      previous.config.onPointerLeave !== next.config.onPointerLeave
    )
  }

  private static shouldRecreateView(previous: RenderNode, next: RenderNode): boolean {
    // recreate view if it has a border while it didn't have one before to preserve z-index
    // as border is a separate view on the zepp os (same with background)
    return (
      ((previous.config.borderWidth === undefined || previous.config.borderWidth <= 0) &&
        next.config.borderWidth !== undefined &&
        next.config.borderWidth > 0) ||
      (previous.config.background === undefined && next.config.background !== undefined)
    )
  }

  private static updateView(previous: RenderNode, next: RenderNode) {
    if (Renderer.shouldUpdateView(previous, next)) {
      ViewManager.updateView(previous, next)
      PointerEventManager.addEventTarget(next)
    }
  }

  private static createNode(node: ViewNode | RootNode, parent?: RenderNode): RenderNode {
    const config = node.config

    // TODO: check whether all or nothing is the right way to handle event inheritance
    if (
      parent !== undefined &&
      node.config.onPointerDown === undefined &&
      node.config.onPointerMove === undefined &&
      node.config.onPointerUp === undefined &&
      node.config.onPointerEnter === undefined &&
      node.config.onPointerLeave === undefined
    ) {
      config.onPointerDown = parent.config.onPointerDown
      config.onPointerMove = parent.config.onPointerMove
      config.onPointerUp = parent.config.onPointerUp
      config.onPointerEnter = parent.config.onPointerEnter
      config.onPointerLeave = parent.config.onPointerLeave
    }

    const result: RenderNode = {
      id: node.id,
      type: node.type,
      config: config,
      children: [],
      view: null,
      zIndex: -1,
      layout: Renderer.createLayout(),
      // @ts-ignore customViewProps doesn't exist on root node, so it will be undefinded anyway
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
      widthInferred: false,
      heightInferred: false,
    }
  }
}

import { NodeType } from '../NodeType.js'
import { PrefixTree } from '../PrefixTree.js'
import { EffectNode } from './EffectNode.js'
import { EventNode } from './EventNode.js'
import { ConfigType } from './props/types.js'
import { RememberNode } from './RememberNode.js'
import { SavedTreeState } from './SavedTreeState.js'
import { ViewNode, ViewNodeProps } from './ViewNode.js'
import { CustomViewProps } from './views/Custom.js'
import { WorkingNode } from './WorkingNode.js'

export const ROOT_ID = '#__root'

export class RootNode extends WorkingNode {
  public savedState?: SavedTreeState
  public children: WorkingNode[]
  public config: ConfigType

  constructor() {
    super({
      id: ROOT_ID,
      type: NodeType.Root,
    })

    this.config = { id: ROOT_ID }
    this.children = []
  }

  public drop(newSubtreeRoot: WorkingNode): void {
    super.drop(newSubtreeRoot)

    for (const child of this.children) {
      child.drop(newSubtreeRoot)
    }
  }
}

export abstract class WorkingTree {
  private static _root: RootNode = new RootNode()
  private static _current: WorkingNode = WorkingTree._root

  private static updatePaths = new PrefixTree()
  private static updateRequested = false

  static get current() {
    return this._current
  }

  static get root() {
    return this._root
  }

  public static saveState() {
    return new SavedTreeState(WorkingTree.root)
  }

  public static restoreState(savedState: SavedTreeState) {
    WorkingTree.root.savedState = savedState
  }

  public static isRestoringState() {
    return WorkingTree.root.savedState !== undefined
  }

  public static withContext(context: WorkingNode, fun?: () => void) {
    if (fun !== undefined) {
      const previousContext = WorkingTree.current
      WorkingTree._current = context
      fun()
      WorkingTree._current.reset()
      WorkingTree._current = previousContext
    }
  }

  public static queueUpdate(context: WorkingNode) {
    this.updatePaths.addPath(context.path.concat(context.id))
  }

  public static requestUpdate() {
    this.updateRequested = true
  }

  public static hasUpdates() {
    return this.updateRequested || !this.updatePaths.isEmpty()
  }

  public static performUpdate() {
    WorkingTree.root.savedState = undefined

    for (const path of this.updatePaths.getPaths()) {
      const nodeToUpdate = WorkingTree.root.getNodeFromPath(path) as ViewNode

      if (nodeToUpdate !== null) {
        const recompositionContext = new ViewNode({
          id: nodeToUpdate.id,
          type: NodeType.Recomposing,
          config: nodeToUpdate.config,
          body: nodeToUpdate.body,
        })

        recompositionContext.override = nodeToUpdate
        recompositionContext.rememberedContext = nodeToUpdate
        recompositionContext.path = nodeToUpdate.path

        WorkingTree.withContext(recompositionContext, nodeToUpdate.body!)

        const droppedChildren = nodeToUpdate.children
        nodeToUpdate.children = recompositionContext.children

        for (const child of droppedChildren) {
          child.drop(nodeToUpdate)
        }
      }
    }

    this.updatePaths.clear()
    this.updateRequested = false
  }

  public static create(parent: WorkingNode, props: ViewNodeProps, customViewProps?: CustomViewProps) {
    const result = new ViewNode(props)

    // new view nodes may only be created inside another view node
    const currentView = WorkingTree.current as ViewNode

    result.customViewProps = customViewProps
    result.parent = currentView.override ?? WorkingTree.current
    result.rememberedContext = currentView.rememberedContext
    result.path = parent.path.concat(parent.id)

    return result
  }

  public static remember(parent: WorkingNode) {
    // remember may only be called inside view node
    const currentView = WorkingTree.current as ViewNode

    const result = new RememberNode({
      id: (currentView.nextActionId++).toString(),
      type: NodeType.Remember,
    })

    result.parent = currentView.override ?? WorkingTree.current
    result.path = parent.path.concat(parent.id)

    return result
  }

  public static effect(parent: WorkingNode) {
    // effects may only be created inside view node
    const currentView = WorkingTree.current as ViewNode

    const result = new EffectNode({
      id: (currentView.nextActionId++).toString(),
      type: NodeType.Effect,
    })

    result.parent = currentView.override ?? WorkingTree.current
    result.path = parent.path.concat(parent.id)

    return result
  }

  public static event(parent: WorkingNode) {
    // events may only be created inside view node
    const currentView = WorkingTree.current as ViewNode

    const result = new EventNode({
      id: (currentView.nextActionId++).toString(),
      type: NodeType.Event,
    })

    result.parent = currentView.override ?? WorkingTree.current
    result.path = parent.path.concat(parent.id)

    return result
  }

  public static dropAll() {
    const newRoot = new RootNode()
    newRoot.savedState = WorkingTree.root.savedState

    WorkingTree._root.drop(newRoot)
    WorkingTree._root = newRoot
    WorkingTree._current = newRoot

    WorkingTree.requestUpdate()
  }
}

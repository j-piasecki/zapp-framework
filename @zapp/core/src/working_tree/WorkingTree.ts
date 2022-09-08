import { NodeType } from '../NodeType.js'
import { PrefixTree } from '../PrefixTree.js'
import { SavedTreeState } from './SavedTreeState.js'
import { ViewNode } from './ViewNode.js'
import { WorkingNode } from './WorkingNode.js'

export const ROOT_ID = '#__root'

class RootNode extends ViewNode {
  public savedState?: SavedTreeState

  constructor() {
    super({
      id: ROOT_ID,
      type: NodeType.Root,
      config: { id: ROOT_ID },
      body: () => {},
    })
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

  public static dropAll() {
    const newRoot = new RootNode()
    newRoot.savedState = WorkingTree.root.savedState

    WorkingTree._root.drop(newRoot)
    WorkingTree._root = newRoot
    WorkingTree._current = newRoot

    WorkingTree.requestUpdate()
  }
}

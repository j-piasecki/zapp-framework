import { NodeType } from '../NodeType.js'
import { PrefixTree } from '../PrefixTree.js'
import { Config } from './Config.js'
import { ViewNode } from './ViewNode.js'
import { WorkingNode } from './WorkingNode.js'

export const ROOT_ID = '#__root'

export abstract class WorkingTree {
  private static _root: WorkingNode = new ViewNode({
    id: ROOT_ID,
    type: NodeType.Root,
    config: new Config(ROOT_ID),
    body: () => {},
  })
  private static _current: WorkingNode = WorkingTree._root

  private static updatePaths = new PrefixTree()

  static get current() {
    return this._current
  }

  static get root() {
    return this._root
  }

  public static withContext(context: WorkingNode, fun: () => void) {
    const previousContext = WorkingTree.current
    WorkingTree._current = context
    fun()
    WorkingTree._current.reset()
    WorkingTree._current = previousContext
  }

  public static queueUpdate(context: WorkingNode) {
    this.updatePaths.addPath(context.path.concat(context.id))
  }

  public static performUpdate() {
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
  }
}

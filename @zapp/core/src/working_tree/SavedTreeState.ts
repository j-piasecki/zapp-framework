import { ViewNode } from './ViewNode.js'
import { WorkingNode } from './WorkingNode.js'
import { RememberNode } from './RememberNode.js'

interface SavedState {
  value?: unknown
}

interface InnerNode {
  id: string
  children: Map<string, InnerNode | LeafNode>
}

interface LeafNode {
  id: string
  state: SavedState
}

export class SavedTreeState {
  private root: InnerNode

  constructor(root: ViewNode) {
    this.root = (this.createNode(root) ?? { id: root.id, children: new Map() }) as InnerNode
  }

  private createNode(node: WorkingNode): InnerNode | LeafNode | null {
    // dont't save nodes without children
    if (node instanceof ViewNode && node.children.length > 0) {
      const result: InnerNode = {
        id: node.id,
        children: new Map(),
      }

      const mappedChildren = node.children.map((child) => this.createNode(child)).filter((child) => child !== null)

      // if there are no children to save, don't save this node
      if (mappedChildren.length > 0) {
        mappedChildren.forEach((child) => {
          result.children.set(child!.id, child!)
        })

        return result
      }
    } else if (node instanceof RememberNode) {
      return {
        id: node.id,
        state: node.remembered.value,
      }
    }

    // TODO: consider saving effects

    return null
  }
}

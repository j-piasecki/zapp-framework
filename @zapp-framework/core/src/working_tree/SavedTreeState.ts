import type { ViewNode } from './ViewNode.js'
import type { RememberNode } from './RememberNode.js'
import type { WorkingNode } from './WorkingNode.js'
import { isViewNode, isRememberNode, isRememberValueMutable } from '../utils.js'

interface SavedState {
  value?: unknown
  animationData?: Record<string, unknown>
}

interface InnerNode {
  id: string
  children: Map<string, InnerNode | LeafNode>
}

interface LeafNode {
  id: string
  state: SavedState
}

function isInnerNode(node: InnerNode | LeafNode): node is InnerNode {
  // @ts-ignore
  return node.children !== undefined
}

export class SavedTreeState {
  private root: InnerNode

  constructor(root: WorkingNode) {
    this.root = (this.createNode(root) ?? { id: root.id, children: new Map() }) as InnerNode
  }

  private createNode(node: WorkingNode): InnerNode | LeafNode | null {
    // dont't save nodes without children
    if (isViewNode(node) && node.children.length > 0) {
      const result: InnerNode = {
        id: node.id,
        children: new Map(),
      }

      const mappedChildren = node.children
        .map((child) => this.createNode(child))
        .filter((child) => child !== null)

      // if there are no children to save, don't save this node
      if (mappedChildren.length > 0) {
        mappedChildren.forEach((child) => {
          result.children.set(child!.id, child!)
        })

        return result
      }
    } else if (isRememberNode(node) && node.remembered.shouldBeSaved()) {
      const result: LeafNode = {
        id: node.id,
        state: {
          value: node.remembered.value,
        },
      }

      if (isRememberValueMutable(node.remembered) && node.remembered.animation !== undefined) {
        result.state.animationData = node.remembered.animation.save()
      }

      return result
    }

    return null
  }

  public tryFindingValue(node: RememberNode): SavedState | undefined {
    let current = this.root
    let index = 0

    if (node.path[index] === current.id) {
      index++ // skip root
    }

    while (index < node.path.length) {
      const id = node.path[index++]
      const children = current.children

      if (children.has(id)) {
        const child = children.get(id)

        if (child !== undefined && isInnerNode(child)) {
          current = child
        } else {
          return undefined
        }
      } else {
        return undefined
      }
    }

    // @ts-ignore
    return current.children.get(node.id)?.state
  }
}

import type { RememberedMutableValue } from './working_tree/effects/RememberedMutableValue.js'
import type { RememberedValue } from './working_tree/effects/RememberedValue.js'
import type { RememberNode } from './working_tree/RememberNode.js'
import type { ViewNode } from './working_tree/ViewNode.js'
import type { WorkingNode } from './working_tree/WorkingNode.js'
import { NodeType } from './NodeType.js'

export function findRelativePath(child: string[], parent?: string[]) {
  if (parent === undefined) {
    return null
  }

  let relativePath: string[] | null = []

  for (let i = 0; i < child.length; i++) {
    if (i < parent.length) {
      if (child[i] !== parent[i]) {
        relativePath = null
        break
      }
    } else {
      relativePath.push(child[i])
    }
  }

  return relativePath
}

export function coerce(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export type RequireSome<T, K extends keyof T> = Partial<T> & Pick<T, K>

export function isViewNode(node: WorkingNode): node is ViewNode {
  return node.type !== NodeType.Remember && node.type !== NodeType.Effect && node.type !== NodeType.Event
}

export function isRememberNode(node: WorkingNode): node is RememberNode {
  return node.type === NodeType.Remember
}

export function isRememberValueMutable<T>(value: RememberedValue<T>): value is RememberedMutableValue<T> {
  return value._isMutable
}

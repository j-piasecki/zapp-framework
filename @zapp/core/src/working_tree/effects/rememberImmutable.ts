import { findRelativePath } from '../../utils.js'
import { RememberNode } from '../RememberNode.js'
import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { RememberedValue } from './RememberedValue.js'

export function remember<T>(value: T): RememberedValue<T> {
  const current = WorkingTree.current as ViewNode
  const context = current.remember()
  let toRemember = value

  const path = findRelativePath(context.path, current.rememberedContext?.path)?.concat(context.id)
  if (path !== null && path !== undefined) {
    const rememberedNode = current.rememberedContext?.getNodeFromPath(path) ?? null

    if (rememberedNode instanceof RememberNode) {
      toRemember = rememberedNode.remembered.value
    }
  }

  const result = new RememberedValue(toRemember, context)

  context.remembered = result

  current.children.push(context)

  return result
}

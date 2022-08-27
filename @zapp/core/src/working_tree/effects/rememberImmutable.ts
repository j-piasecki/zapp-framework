import { findRelativePath } from '../../utils.js'
import { RememberNode } from '../RememberNode.js'
import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { RememberedValue } from './RememberedValue.js'

export function remember<T>(value: T): RememberedValue<T> {
  const current = WorkingTree.current as ViewNode
  const context = current.remember()

  let savedRemembered: RememberedValue<T> | null = null

  const path = findRelativePath(context.path, current.rememberedContext?.path)?.concat(context.id)
  if (path !== null && path !== undefined) {
    const rememberedNode = current.rememberedContext?.getNodeFromPath(path) ?? null

    if (rememberedNode instanceof RememberNode) {
      savedRemembered = rememberedNode.remembered
      // TODO: investigate context switching in remembered values more
      savedRemembered.switchContext(context)
    }
  }

  const result = savedRemembered === null ? new RememberedValue(value, context) : savedRemembered

  context.remembered = result

  current.children.push(context)

  return result
}

import { findRelativePath } from '../../utils.js'
import { RememberNode } from '../RememberNode.js'
import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { RememberedMutableValue } from './RememberedMutableValue.js'
import { Animation, AnimationType } from './animation/Animation.js'
import { TimingAnimation } from './animation/TimingAnimation.js'

export function remember<T>(value: T): RememberedMutableValue<T> {
  const current = WorkingTree.current as ViewNode
  const context = current.remember()

  let savedRemembered: RememberedMutableValue<T> | null = null

  const restoredState = WorkingTree.root.savedState?.tryFindingValue?.(context)

  if (restoredState !== undefined) {
    value = restoredState.value as T
  } else {
    const path = findRelativePath(context.path, current.rememberedContext?.path)?.concat(context.id)
    if (path !== null && path !== undefined) {
      const rememberedNode = current.rememberedContext?.getNodeFromPath(path) ?? null

      if (rememberedNode instanceof RememberNode && rememberedNode.remembered instanceof RememberedMutableValue) {
        savedRemembered = rememberedNode.remembered
        // TODO: investigate context switching in remembered values more
        savedRemembered.switchContext(context)
      }
    }
  }

  const result = savedRemembered === null ? new RememberedMutableValue(value, context) : savedRemembered

  if (restoredState !== undefined && restoredState.animationData !== undefined) {
    let anim: Animation<unknown> | null = null

    if (restoredState.animationData.type === AnimationType.Timing) {
      anim = TimingAnimation.restore(restoredState.animationData)
    }

    if (anim !== null) {
      // when restoring animation from saved state, assign directly
      anim.rememberedValue = result
      result.animation = anim as Animation<T>
    }
  }

  context.remembered = result
  current.children.push(context)

  return result
}

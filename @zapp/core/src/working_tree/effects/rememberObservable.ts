import { findRelativePath } from '../../utils.js'
import { RememberNode } from '../RememberNode.js'
import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { RememberedMutableValue } from './RememberedMutableValue.js'
import { Animation, AnimationType } from './animation/Animation.js'
import { TimingAnimation } from './animation/TimingAnimation.js'
import { RepeatAnimation } from './animation/RepeatAnimation.js'

export function rememberObservable<T>(
  value: T,
  observer?: (previous: T, current: T) => void,
  onValueRestored?: (value: T) => void
): RememberedMutableValue<T> {
  const current = WorkingTree.current as ViewNode
  const context = WorkingTree.remember(current)

  let savedRemembered: RememberedMutableValue<T> | null = null

  const restoredState = WorkingTree.root.savedState?.tryFindingValue?.(context)

  if (restoredState !== undefined) {
    value = restoredState.value as T

    onValueRestored?.(value)
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
    } else if (restoredState.animationData.type === AnimationType.Repeat) {
      anim = RepeatAnimation.restore(restoredState.animationData)
    }

    if (anim !== null) {
      // when restoring animation from saved state, assign directly
      anim.rememberedValue = result
      result.animation = anim as Animation<T>
    }
  }

  result._observer = observer
  context.remembered = result
  current.children.push(context)

  return result
}

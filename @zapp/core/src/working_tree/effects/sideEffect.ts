import { EffectNode } from '../EffectNode.js'
import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'

export function sideEffect(effect: (isRestoring: boolean) => (() => void) | void, ...keys: any) {
  const current = WorkingTree.current as ViewNode
  const context = current.effect()

  const path = context.path.slice(current.rememberedContext?.path.length).concat(context.id)
  const rememberedNode = current.rememberedContext?.getNodeFromPath(path) ?? null

  if (rememberedNode instanceof EffectNode) {
    let relaunch = false

    if (keys.length !== rememberedNode.keys.length) {
      relaunch = true
    } else {
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== rememberedNode.keys[i]) {
          relaunch = true
          break
        }
      }
    }

    if (relaunch) {
      rememberedNode.effectCleanup?.()

      context.effect = effect
      WorkingTree.withContext(context, () => {
        context.effectCleanup = effect(WorkingTree.isRestoringState()) as (() => void) | undefined
      })
      context.keys = keys
    } else {
      context.effect = rememberedNode.effect
      context.effectCleanup = rememberedNode.effectCleanup
      context.keys = rememberedNode.keys
    }
  } else {
    context.effect = effect
    WorkingTree.withContext(context, () => {
      context.effectCleanup = effect(WorkingTree.isRestoringState()) as (() => void) | undefined
    })
    context.keys = keys
  }

  current.children.push(context)
}

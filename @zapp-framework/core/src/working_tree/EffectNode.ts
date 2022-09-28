import { findRelativePath } from '../utils.js'
import { WorkingNode } from './WorkingNode.js'

export class EffectNode extends WorkingNode {
  public effect: (isRestoring: boolean) => (() => void) | void
  public effectCleanup?: () => void
  public keys: any[]

  public override drop(newSubtreeRoot: WorkingNode): void {
    super.drop(newSubtreeRoot)

    const thisPath = this.path.concat(this.id)
    const relativePath = findRelativePath(thisPath, newSubtreeRoot.path)

    if (relativePath !== null) {
      const nodeAtPath = newSubtreeRoot.getNodeFromPath(relativePath)
      if (nodeAtPath === null) {
        this.effectCleanup?.()
      }
    }
  }
}

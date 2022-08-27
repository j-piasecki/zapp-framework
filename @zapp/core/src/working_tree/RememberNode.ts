import { RememberedValue } from './effects/RememberedValue.js'
import { WorkingNode } from './WorkingNode.js'
import { findRelativePath } from '../utils.js'
import { RememberedMutableValue } from './effects/RememberedMutableValue.js'

export class RememberNode extends WorkingNode {
  public remembered: RememberedValue<any>

  public override drop(newSubtreeRoot: WorkingNode): void {
    super.drop(newSubtreeRoot)

    if (this.remembered instanceof RememberedMutableValue && this.remembered.animation !== undefined) {
      const thisPath = this.path.concat(this.id)
      const relativePath = findRelativePath(thisPath, newSubtreeRoot.path)

      if (relativePath !== null) {
        const nodeAtPath = newSubtreeRoot.getNodeFromPath(relativePath)
        if (nodeAtPath === null) {
          this.remembered.animation.drop()
        }
      }
    }
  }
}

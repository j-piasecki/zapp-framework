import { RememberNode } from '../RememberNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { RememberedValue } from './RememberedValue.js'

export class RememberedMutableValue<T> extends RememberedValue<T> {
  public get value() {
    return this._value
  }

  public set value(newValue: T) {
    const oldValue = this._value
    this._value = newValue

    if (this.context.isDropped) {
      const newNode = WorkingTree.root.getNodeFromPath(this.context.path.concat(this.context.id))
      if (newNode !== null) {
        const remembered = (newNode as RememberNode).remembered as RememberedMutableValue<T>
        remembered.value = newValue
      }
    } else if (oldValue !== newValue) {
      WorkingTree.queueUpdate(this.context.parent!)
    }
  }
}

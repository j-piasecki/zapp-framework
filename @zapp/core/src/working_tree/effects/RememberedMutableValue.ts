import { RememberNode } from '../RememberNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { RememberedValue } from './RememberedValue.js'
import { Animation } from './animation/Animation.js'

export class RememberedMutableValue<T> extends RememberedValue<T> {
  private _animation?: Animation<unknown>

  /** @internal */
  get animation() {
    return this._animation
  }

  public get value(): T {
    return this._value
  }

  public set value(newValue: T | Animation<T>) {
    if (newValue instanceof Animation) {
      if (this._animation !== undefined) {
        this._animation.drop()
      }

      newValue.rememberedValue = this
      newValue.startValue = this._value

      this._animation = newValue
    } else {
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
}

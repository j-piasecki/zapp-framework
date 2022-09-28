import { RememberNode } from '../RememberNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { RememberedValue } from './RememberedValue.js'
import { Animation } from './animation/Animation.js'
import { EffectNode } from '../EffectNode.js'

export class RememberedMutableValue<T> extends RememberedValue<T> {
  private _animation?: Animation<unknown>

  /** @internal */
  public _isMutable = true

  /** @internal */
  public _observer?: (previous: T, current: T) => void

  /** @internal */
  get animation() {
    return this._animation
  }

  /** @internal */
  set animation(animation: Animation<unknown> | undefined) {
    this._animation = animation
  }

  public get value(): T {
    return this._value
  }

  public set value(newValue: T | Animation<T>) {
    // skip assignment of the new value if we are currently restoring saved state and we are inside side effect
    const skipAssignment =
      WorkingTree.current instanceof EffectNode && WorkingTree.isRestoringState()

    if (newValue instanceof Animation) {
      if (skipAssignment && this._animation !== undefined) {
        // we need to recalculate the end callbacks so they have correct closure but we need to drop the
        // newly created animation
        this._animation.inheritEndCallback(newValue)
        newValue.drop()
      } else {
        if (this._animation !== undefined) {
          this._animation.drop()
        }
        this._animation = newValue

        // set starting value only when assigning a new animation in order not to override the restored one
        this._animation.startValue = this._value
      }

      this._animation.rememberedValue = this
    } else if (!skipAssignment) {
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

        // invoke observer only if node is in active tree, otherwise the assignment is delegated to
        // the node in active tree, which should trigger its observer
        this._observer?.(oldValue, newValue)
      }
    }
  }
}

import { WorkingTree } from '../WorkingTree.js'
import { RememberedValue } from './RememberedValue.js'

export class RememberedMutableValue<T> extends RememberedValue<T> {
  public get value() {
    return this._value
  }

  public set value(val: T) {
    this._value = val

    WorkingTree.queueUpdate(this.context)
  }
}

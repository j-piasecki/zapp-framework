import { RememberNode } from '../RememberNode.js'

export class RememberedValue<T> {
  protected _value: T
  protected context: RememberNode

  constructor(val: T, context: RememberNode) {
    this._value = val
    this.context = context
  }

  public get value() {
    return this._value
  }
}

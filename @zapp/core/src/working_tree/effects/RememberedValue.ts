import { RememberNode } from '../RememberNode.js'

export class RememberedValue<T> {
  protected _value: T
  protected context: RememberNode

  /** @internal */
  public _isMutable = false

  constructor(val: T, context: RememberNode) {
    this._value = val
    this.context = context
  }

  public get value() {
    return this._value
  }

  /** @internal */
  public switchContext(context: RememberNode) {
    this.context = context
  }

  /** @internal */
  public shouldBeSaved() {
    return typeof this._value !== 'function'
  }
}

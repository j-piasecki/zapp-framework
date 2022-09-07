import { RememberNode } from '../RememberNode.js'

export enum RememberedValueType {
  Immutable,
  Mutable,
  Launcher,
}

export class RememberedValue<T> {
  protected _value: T
  protected context: RememberNode
  protected type: RememberedValueType

  constructor(val: T, context: RememberNode) {
    this._value = val
    this.context = context
    this.type = RememberedValueType.Immutable
  }

  public get value() {
    return this._value
  }

  /** @internal */
  public switchContext(context: RememberNode) {
    this.context = context
  }

  /** @internal */
  public setType(type: RememberedValueType) {
    this.type = type
  }

  /** @internal */
  public shouldBeSaved() {
    return this.type !== RememberedValueType.Launcher && typeof this._value !== 'function'
  }
}

import { ViewNode } from '../ViewNode.js'

export class RememberedValue<T> {
  protected _value: T
  protected context: ViewNode

  constructor(val: T, context: ViewNode) {
    this._value = val
    this.context = context
  }

  public get value() {
    return this._value
  }
}

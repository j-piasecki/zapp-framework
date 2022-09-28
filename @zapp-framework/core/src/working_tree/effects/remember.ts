import { RememberedMutableValue } from './RememberedMutableValue.js'
import { rememberObservable } from './rememberObservable.js'

export function remember<T>(value: T): RememberedMutableValue<T> {
  return rememberObservable(value)
}

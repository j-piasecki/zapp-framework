import { RememberedMutableValue } from '../RememberedMutableValue.js'
import { Easing } from './Easing.js'

export interface AnimationProps {
  onEnd?: () => void
  easing?: (t: number) => number
}

export abstract class Animation<T> {
  protected static runningAnimations: Animation<unknown>[] = []

  public static nextFrame(timestamp: number) {
    for (const animation of Animation.runningAnimations) {
      animation.onFrame(timestamp)
    }

    Animation.runningAnimations = Animation.runningAnimations.filter((animation) => animation.isRunning)
  }

  // set when assigned to a remembered value
  public startValue: T
  public rememberedValue: RememberedMutableValue<T>

  protected startTimestamp: number
  protected endHandler?: () => void
  protected easingFunction: (t: number) => number
  protected isRunning = true

  constructor(props?: AnimationProps) {
    this.endHandler = props?.onEnd
    this.easingFunction = props?.easing ?? Easing.linear

    this.startTimestamp = Date.now()
    Animation.runningAnimations.push(this)
  }

  public abstract onFrame(timestamp: number): void

  public onEnd() {
    if (this.isRunning) {
      this.isRunning = false
      this.endHandler?.()
    }
  }

  public drop() {
    this.onEnd()

    const index = Animation.runningAnimations.indexOf(this)
    if (index !== -1) {
      Animation.runningAnimations.splice(index, 1)
    }
  }
}

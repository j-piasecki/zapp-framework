import { RememberedMutableValue } from '../RememberedMutableValue.js'

export interface AnimationProps {
  onEnd?: (completed: boolean) => void
}

export enum AnimationType {
  Timing,
  Repeat,
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
  public isFinished = false

  protected startTimestamp: number
  protected endHandler?: (completed: boolean) => void
  protected isRunning = true

  constructor(props?: AnimationProps) {
    this.endHandler = props?.onEnd

    this.startTimestamp = Date.now()
    Animation.runningAnimations.push(this)
  }

  public abstract calculateValue(timestamp: number): T

  public calculateReversedValue(value: T) {
    return value
  }

  public onFrame(timestamp: number) {
    this.rememberedValue.value = this.calculateValue(timestamp)

    if (this.isFinished) {
      this.onEnd(true)
    }
  }

  protected onEnd(completed: boolean) {
    if (this.isRunning) {
      this.isRunning = false
      this.endHandler?.(completed)
    }
  }

  public drop() {
    this.onEnd(false)

    const index = Animation.runningAnimations.indexOf(this)
    if (index !== -1) {
      Animation.runningAnimations.splice(index, 1)
    }
  }

  public reset() {
    this.startTimestamp = Date.now()
    this.isFinished = false
    this.isRunning = true
  }

  public inheritEndCallback(from: Animation<T>) {
    this.endHandler = from.endHandler
    from.endHandler = undefined
  }

  public save(): Record<string, unknown> | undefined {
    return {
      startValue: this.startValue,
    }
  }
}

import { Animation, AnimationProps, AnimationType } from './Animation.js'
import { coerce } from '../../../utils.js'
import { Easing } from './Easing.js'

const DEFAULT_DURATION = 300

export interface TimingAnimationProps extends AnimationProps {
  duration?: number
  easing?: (t: number) => number
}

export class TimingAnimation extends Animation<number> {
  private targetValue: number
  private duration: number
  private progress: number
  private easingFunction: (t: number) => number

  constructor(targetValue: number, props?: TimingAnimationProps) {
    super(props)

    this.progress = 0
    this.targetValue = targetValue
    this.duration = props?.duration ?? DEFAULT_DURATION
    this.easingFunction = props?.easing ?? Easing.linear
  }

  public calculateValue(timestamp: number): number {
    this.progress = coerce((timestamp - this.startTimestamp) / this.duration, 0, 1)

    if (this.progress === 1) {
      this.isFinished = true
    }

    return this.startValue + (this.targetValue - this.startValue) * this.easingFunction(this.progress)
  }

  public calculateReversedValue(value: number): number {
    return this.targetValue - value + this.startValue
  }

  public save(): Record<string, unknown> | undefined {
    const result = super.save()!

    result.type = AnimationType.Timing
    result.targetValue = this.targetValue
    result.duration = this.duration
    result.progress = this.progress
    result.easingFunction = this.easingFunction

    return result
  }

  public static restore(from: Record<string, unknown>): TimingAnimation {
    const result = new TimingAnimation(from.targetValue as number)

    result.startValue = from.startValue as number
    result.duration = from.duration as number
    result.progress = from.progress as number
    result.easingFunction = from.easingFunction as (t: number) => number
    result.startTimestamp = Date.now() - result.duration * result.progress

    return result
  }
}

export function withTiming(targetValue: number, props?: TimingAnimationProps) {
  return new TimingAnimation(targetValue, props)
}

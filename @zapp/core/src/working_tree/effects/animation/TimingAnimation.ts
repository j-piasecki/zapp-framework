import { Animation, AnimationProps } from './Animation.js'
import { coerce } from '../../../utils.js'

const DEFAULT_DURATION = 300

export interface TimingAnimationProps extends AnimationProps {
  duration?: number
}

export class TimingAnimation extends Animation<number> {
  private targetValue: number
  private duration: number

  constructor(targetValue: number, props?: TimingAnimationProps) {
    super(props)

    this.targetValue = targetValue
    this.duration = props?.duration ?? DEFAULT_DURATION
  }

  public onFrame(timestamp: number): void {
    const progress = coerce((timestamp - this.startTimestamp) / this.duration, 0, 1)
    this.rememberedValue.value = this.startValue + (this.targetValue - this.startValue) * this.easingFunction(progress)

    if (progress === 1) {
      this.onEnd(true)
    }
  }
}

export function withTiming(targetValue: number, props?: TimingAnimationProps) {
  return new TimingAnimation(targetValue, props)
}

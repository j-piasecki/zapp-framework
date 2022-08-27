import { Animation } from './Animation.js'
import { coerce } from '../../../utils.js'

const DEFAULT_DURATION = 300

// TODO: some kind of easing if the performance is not terrible

export class TimingAnimation extends Animation<number> {
  private targetValue: number
  private duration: number

  constructor(targetValue: number, duration: number, onEnd?: () => void) {
    super()

    this.targetValue = targetValue
    this.duration = duration
    this.endHandler = onEnd
  }

  public onFrame(timestamp: number): void {
    const progress = coerce((timestamp - this.startTimestamp) / this.duration, 0, 1)
    this.rememberedValue.value = this.startValue + (this.targetValue - this.startValue) * progress

    if (progress === 1) {
      this.onEnd()
    }
  }
}

export function withTiming(targetValue: number): TimingAnimation
export function withTiming(targetValue: number, duration: number): TimingAnimation
export function withTiming(targetValue: number, onEnd: () => void): TimingAnimation
export function withTiming(targetValue: number, duration: number, onEnd: () => void): TimingAnimation
export function withTiming(targetValue: number, durationOrEnd?: number | (() => void), onEnd?: () => void) {
  if (onEnd !== undefined && durationOrEnd !== undefined) {
    return new TimingAnimation(targetValue, durationOrEnd as number, onEnd)
  } else if (durationOrEnd !== undefined) {
    if (typeof durationOrEnd === 'number') {
      return new TimingAnimation(targetValue, durationOrEnd)
    } else {
      return new TimingAnimation(targetValue, DEFAULT_DURATION, durationOrEnd)
    }
  } else {
    return new TimingAnimation(targetValue, DEFAULT_DURATION)
  }
}

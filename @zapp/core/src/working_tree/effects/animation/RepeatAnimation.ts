import { Animation, AnimationProps, AnimationType } from './Animation.js'
import { coerce } from '../../../utils.js'
import { TimingAnimation } from './TimingAnimation.js'
import { RememberedMutableValue } from '../RememberedMutableValue.js'

export interface RepeatAnimationProps extends AnimationProps {
  repeatCount?: number
  reverse?: boolean
}

export class RepeatAnimation extends Animation<number> {
  private animation: Animation<number>
  private repeatCount: number
  private reverse: boolean
  private repetitionsDone: number

  constructor(animation: Animation<number>, props?: RepeatAnimationProps) {
    super(props)

    this.animation = animation
    this.repeatCount = props?.repeatCount ?? -1
    this.reverse = props?.reverse ?? false
    this.repetitionsDone = 0

    const index = Animation.runningAnimations.indexOf(animation)
    if (index !== -1) {
      Animation.runningAnimations.splice(index, 1)
    }
  }

  public calculateValue(timestamp: number): number {
    this.animation.startValue = this.startValue
    this.animation.rememberedValue = this.rememberedValue

    const value =
      this.reverse && this.repetitionsDone % 2 !== 0
        ? this.animation.calculateReversedValue(this.animation.calculateValue(timestamp))
        : this.animation.calculateValue(timestamp)

    if (this.animation.isFinished) {
      this.repetitionsDone++

      if (this.repeatCount > 0 && this.repetitionsDone >= this.repeatCount) {
        this.isFinished = true
      } else {
        this.animation.reset()
      }
    }

    return value
  }

  public save(): Record<string, unknown> | undefined {
    const result = super.save()!

    result.type = AnimationType.Repeat
    result.repeatCount = this.repeatCount
    result.reverse = this.reverse
    result.repetitionsDone = this.repetitionsDone
    result.animation = this.animation.save()

    return result
  }

  public static restore(from: Record<string, unknown>): RepeatAnimation | null {
    let restored: Animation<number>
    // @ts-ignore
    if (from.animation.type === AnimationType.Timing) {
      restored = TimingAnimation.restore(from.animation as Record<string, unknown>)
    } else {
      return null
    }

    const result = new RepeatAnimation(restored)

    result.startValue = from.startValue as number
    result.repeatCount = from.repeatCount as number
    result.reverse = from.reverse as boolean
    result.repetitionsDone = from.repetitionsDone as number

    return result
  }
}

export function withRepeat(animation: Animation<number>, props?: RepeatAnimationProps) {
  return new RepeatAnimation(animation, props)
}

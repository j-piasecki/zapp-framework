import { WorkingTree } from '../working_tree/WorkingTree'
import { Config } from '../working_tree/props/Config'
import { Column } from '../working_tree/views/Column'
import { SimpleScreen } from '../working_tree/views/Screen'
import { Row } from '../working_tree/views/Row'
import { RememberedMutableValue } from '../working_tree/effects/RememberedMutableValue'
import { remember } from '../working_tree/effects/remember'
import { sideEffect } from '../working_tree/effects/sideEffect'
import { Animation } from '../working_tree/effects/animation/Animation'
import { withTiming } from '../working_tree/effects/animation/TimingAnimation'
import { Platform, ScreenShape, setZappInterface } from '../ZappInterface'

jest.useFakeTimers()

setZappInterface({
  startLoop: () => null,
  stopLoop: () => null,
  setValue: () => null,
  getValue: () => null,
  platform: Platform.Web,
  screenShape: ScreenShape.Square,
})

afterEach(() => {
  WorkingTree.dropAll()
  jest.setSystemTime(0)
})

test('Tree is generated correctly', () => {
  SimpleScreen(Config('screen'), () => {
    Column(Config('column'), () => {
      const visible = remember(true)

      if (visible.value) {
        Row(Config('row1'), () => {})
      }
      Row(Config('row2'), () => {})
    })
  })

  const generatedTree = WorkingTree.root.toString()
  expect(generatedTree).toMatchSnapshot()
})

test('Tree is generated correctly after update', () => {
  let remembered: RememberedMutableValue<boolean>

  SimpleScreen(Config('screen'), () => {
    Column(Config('column'), () => {
      const visible = remember(true)
      remembered = visible

      if (visible.value) {
        Row(Config('row1'), () => {})
      }
      Row(Config('row2'), () => {})
    })
  })

  remembered!.value = false
  WorkingTree.performUpdate()

  const generatedTree = WorkingTree.root.toString()
  expect(generatedTree).toMatchSnapshot()
})

test('Tree is not re-generated after setting the same value', () => {
  const fn = jest.fn()
  let remembered: RememberedMutableValue<boolean>

  SimpleScreen(Config('screen'), () => {
    Column(Config('column'), () => {
      const visible = remember(true)
      remembered = visible

      fn()

      if (visible.value) {
        Row(Config('row1'), () => {})
      }
      Row(Config('row2'), () => {})
    })
  })

  remembered!.value = true
  WorkingTree.performUpdate()

  expect(fn).toBeCalledTimes(1)
})

test('Side effect is not triggered when non-key value changes', () => {
  const effect = jest.fn()
  let remembered: RememberedMutableValue<boolean>

  SimpleScreen(Config('screen'), () => {
    const value = remember(true)
    remembered = value

    Column(Config('column'), () => {
      sideEffect(() => {
        effect()
      })
    })
  })

  remembered!.value = false
  WorkingTree.performUpdate()

  expect(effect).toBeCalledTimes(1)
})

test('Side effect is triggered when key value changes', () => {
  const effect = jest.fn()
  const effectDispose = jest.fn()
  let remembered: RememberedMutableValue<number>

  SimpleScreen(Config('screen'), () => {
    const value = remember(1)
    remembered = value

    Column(Config('column'), () => {
      sideEffect(() => {
        effect()

        return effectDispose
      }, value.value)
    })
  })

  // @ts-ignore Ahh, gotta love TS
  remembered!.value++
  WorkingTree.performUpdate()

  expect(effect).toBeCalledTimes(2)
  expect(effectDispose).toBeCalledTimes(1)
})

test('Side effect is disposed of when it leaves the tree', () => {
  const effect = jest.fn()
  const effectDispose = jest.fn()
  let remembered: RememberedMutableValue<boolean>

  SimpleScreen(Config('screen'), () => {
    const value = remember(true)
    remembered = value

    if (value.value) {
      Column(Config('column'), () => {
        sideEffect(() => {
          effect()

          return effectDispose
        })
      })
    }
  })

  remembered!.value = false
  WorkingTree.performUpdate()

  expect(effect).toBeCalledTimes(1)
  expect(effectDispose).toBeCalledTimes(1)
})

test('Value is updated correctly when captured in closure', () => {
  let remembered: RememberedMutableValue<number>

  SimpleScreen(Config('screen'), () => {
    const value = remember(1)
    remembered = value

    Column(Config('column'), () => {
      sideEffect(() => {
        setTimeout(() => {
          value.value = 5
          WorkingTree.performUpdate()
        }, 100)
      })
    })
  })

  remembered!.value = 2
  WorkingTree.performUpdate()

  const generatedTree1 = WorkingTree.root.toString()
  expect(generatedTree1).toMatchSnapshot()

  jest.advanceTimersByTime(100)

  const generatedTree2 = WorkingTree.root.toString()
  expect(generatedTree2).toMatchSnapshot()
})

test('Value is updated correctly when assigned an animation', () => {
  const onEnd = jest.fn()

  SimpleScreen(Config('screen'), () => {
    const value = remember(0)

    sideEffect(() => {
      value.value = withTiming(100, { duration: 1000, onEnd: onEnd })
    })
  })

  Animation.nextFrame(Date.now())
  WorkingTree.performUpdate()

  const generatedTree1 = WorkingTree.root.toString()
  expect(generatedTree1).toMatchSnapshot()

  jest.setSystemTime(500)
  Animation.nextFrame(Date.now())
  WorkingTree.performUpdate()

  const generatedTree2 = WorkingTree.root.toString()
  expect(generatedTree2).toMatchSnapshot()

  jest.setSystemTime(1000)
  Animation.nextFrame(Date.now())
  WorkingTree.performUpdate()

  const generatedTree3 = WorkingTree.root.toString()
  expect(generatedTree3).toMatchSnapshot()

  expect(onEnd).toBeCalledTimes(1)
})

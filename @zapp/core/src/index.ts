import { remember } from './working_tree/effects/remember.js'
import { RememberedMutableValue } from './working_tree/effects/RememberedMutableValue.js'
import { sideEffect } from './working_tree/effects/sideEffect.js'
import { Column } from './working_tree/views/Column.js'
import { Row } from './working_tree/views/Row.js'
import { Screen } from './working_tree/views/Screen.js'
import { WorkingTree } from './working_tree/WorkingTree.js'
import { Config } from './working_tree/props/Config.js'
import { Animation } from './working_tree/effects/animation/Animation.js'
import { withTiming } from './working_tree/effects/animation/TimingAnimation.js'

let remembered: RememberedMutableValue<boolean>

Screen(Config('screen'), () => {
  const test = remember(false)
  remembered = test

  Column(Config('col'), () => {
    if (test.value) {
      Row(Config('row1'), () => {
        sideEffect(() => {
          return () => {
            console.log('drop row')
          }
        })
      })
    }
    Row(Config('row2'), () => {
      const r = remember(0)

      sideEffect(() => {
        r.value = withTiming(100, 10000)

        setTimeout(() => {
          r.value = withTiming(-100, 5000)
        }, 5000)
      })

      sideEffect(() => {
        const value = r.value
        console.log(value)

        return () => {
          console.log('drop effect for', value)
        }
      }, r.value)
    })
  })
})

WorkingTree.root.show()
remembered!.value = true
WorkingTree.performUpdate()

setInterval(() => {
  Animation.nextFrame(Date.now())
  WorkingTree.performUpdate()
}, 1000)

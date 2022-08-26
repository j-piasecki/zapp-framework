import { remember } from './working_tree/effects/remember.js'
import { RememberedMutableValue } from './working_tree/effects/RememberedMutableValue.js'
import { sideEffect } from './working_tree/effects/sideEffect.js'
import { Column } from './working_tree/views/Column.js'
import { Row } from './working_tree/views/Row.js'
import { Screen } from './working_tree/views/Screen.js'
import { WorkingTree } from './working_tree/WorkingTree.js'

let remembered: RememberedMutableValue<boolean>

Screen({ id: 'screen' }, () => {
  const test = remember(false)
  remembered = test

  Column({ id: 'col' }, () => {
    if (test.value) {
      Row({ id: 'row1' }, () => {
        sideEffect(() => {
          return () => {
            console.log('drop row')
          }
        })
      })
    }
    Row({ id: 'row2' }, () => {
      const r = remember(1)

      sideEffect(() => {
        const value = r.value
        console.log(value)

        return () => {
          console.log('drop effect for', value)
        }
      }, r.value)

      if (test.value) {
        setTimeout(() => {
          r.value++
          WorkingTree.performUpdate()
          //WorkingTree.root.show()
        }, 1000)
      }
    })
  })
})

WorkingTree.root.show()
remembered!.value = true
WorkingTree.performUpdate()
//WorkingTree.root.show()

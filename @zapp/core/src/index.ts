import { remember } from './working_tree/effects/remember.js'
import { RememberedMutableValue } from './working_tree/effects/RememberedMutableValue.js'
import { Column } from './working_tree/views/Column.js'
import { Row } from './working_tree/views/Row.js'
import { Screen } from './working_tree/views/Screen.js'
import { WorkingTree } from './working_tree/WorkingTree.js'

let remembered: RememberedMutableValue<boolean>

Screen({ id: 'screen' }, () => {
  Column({ id: 'col' }, () => {
    const test = remember(true)
    remembered = test

    if (test.value) {
      Row({ id: 'row1' }, () => {})
    }
    Row({ id: 'row2' }, () => {})
  })
})

WorkingTree.root.show()
remembered!.value = false
WorkingTree.performUpdate()
WorkingTree.root.show()
remembered!.value = true
WorkingTree.performUpdate()
WorkingTree.root.show()

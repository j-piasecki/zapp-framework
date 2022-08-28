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
import { Renderer } from './renderer/Renderer.js'

let remembered: RememberedMutableValue<boolean>

Screen(Config('screen'), () => {
  const test = remember(true)
  remembered = test

  Column(Config('col').fillSize(), () => {
    if (test.value) {
      Row(Config('row1').fillWidth(0.5).weight(1), () => {})
    }

    Row(Config('row2'), () => {})

    Column(Config('col2').fillWidth(0.75).weight(2), () => {
      Row(Config('row3').padding(20), () => {
        Column(Config('col3').width(50).height(50), () => {})
        Column(Config('col4').width(50).height(50), () => {})
      })
    })
  })
})

WorkingTree.performUpdate()
Renderer.commit(WorkingTree.root)
Renderer.render()

// remembered!.value = false

// WorkingTree.performUpdate()
// Renderer.commit(WorkingTree.root)
// Renderer.render()

import '@zapp/web'
import {
  WorkingTree,
  Animation,
  Renderer,
  Screen,
  Config,
  Column,
  Row,
  remember,
  sideEffect,
  withTiming,
} from '@zapp/core'

Screen(Config('screen').background(0x000000), () => {
  const padding = remember(0)

  sideEffect(() => {
    padding.value = withTiming(100, 2000)
  })

  Column(Config('col').fillSize().padding(padding.value), () => {
    const weight = remember(2)
    const size = remember(50)

    sideEffect(() => {
      weight.value = withTiming(1, 3000)
      size.value = withTiming(200, 3000)
    })

    Row(Config('row1').fillWidth(0.5).weight(1).background(0xff0000), () => {})

    const background = size.value < 100 ? 0xffffff : undefined

    Column(Config('col2').fillWidth(0.75).weight(weight.value).background(0x00ff00), () => {
      Row(Config('row3').padding(20).background(0x0000ff), () => {
        Column(Config('col3').width(size.value).height(size.value).background(0xff00ff), () => {})
        // @ts-ignore
        Column(Config('margin').padding(size.value, 0, 0, 0).background(background), () => {
          Column(Config('col4').width(50).height(50).background(0x00ffff), () => {})
        })
      })
    })
  })
})

function update() {
  Animation.nextFrame(Date.now())
  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  requestAnimationFrame(update)
}

requestAnimationFrame(update)

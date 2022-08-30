import '@zapp/web'
import {
  WorkingTree,
  Animation,
  Renderer,
  Screen,
  Config,
  Column,
  Row,
  Text,
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
        Column(Config('col3').width(size.value).height(size.value).background(0xff00ff), () => {
          Column(Config('pad1').padding(10).background(0x9f0000), () => {
            Column(Config('pad2').padding(10).background(0x009f00), () => {
              Text(Config('text'), 'a b c d e f g h i j k l m n o p q r s t u v w x y z')
            })
          })
        })
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

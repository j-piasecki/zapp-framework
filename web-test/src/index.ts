import '@zapp/web'
import {
  WorkingTree,
  Animation,
  Renderer,
  Screen,
  Config,
  TextConfig,
  Column,
  Row,
  Text,
  remember,
  sideEffect,
  withTiming,
  EventManager,
} from '@zapp/core'

Screen(Config('screen').background(0x000000), () => {
  const padding = remember(0)
  const start = remember({ x: 0, y: 0 })
  const position = remember({ x: 0, y: 0 })

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

    Row(Config('row1').fillWidth(1).weight(1), () => {
      Row(Config('row1.1').fillHeight(1).weight(1).background(0xff0000), () => {})
      Row(Config('row1.2').fillHeight(0.5).weight(1).background(0xaa2299), () => {})
    })

    const background = size.value > 100 ? 0xffffff : undefined

    Column(
      Config('col2')
        .fillWidth(0.75)
        .weight(weight.value)
        .background(0x00ff00)
        .onPointerDown(() => {
          console.log('down')
        })
        .onPointerMove(() => {
          console.log('move')
        })
        .onPointerUp(() => {
          console.log('up')
        })
        .onPointerEnter(() => {
          console.log('enter')
        })
        .onPointerLeave(() => {
          console.log('leave')
        }),
      () => {
        Row(Config('row3').padding(20).background(0x0000ff), () => {
          Column(Config('col3').width(size.value).height(size.value).background(0xff00ff), () => {
            Column(Config('pad1').padding(10).background(0x9f0000), () => {
              Column(Config('pad2').padding(10).background(0x009f00), () => {
                Text(
                  TextConfig('text').textColor(0xffffff).textSize(20),
                  'a b c d e f g h i j k l m n o p q r s t u v w x y z'
                )
              })
            })
          })
          // @ts-ignore
          Column(Config('margin').padding(size.value, 0, 0, 0).background(background), () => {
            Column(
              Config('col4')
                .width(50)
                .height(50)
                .background(0x00ffff)
                .onPointerDown((e) => {
                  start.value = { x: e.x, y: e.y }
                })
                .onPointerMove((e) => {
                  position.value = {
                    x: position.value.x + e.x - start.value.x,
                    y: position.value.y + e.y - start.value.y,
                  }

                  start.value = { x: e.x, y: e.y }
                })
                .offset(position.value.x, position.value.y),
              () => {}
            )
          })
        })
      }
    )
  })
})

function update() {
  EventManager.processEvents()
  Animation.nextFrame(Date.now())

  if (WorkingTree.hasUpdates()) {
    WorkingTree.performUpdate()
    Renderer.commit(WorkingTree.root)
    Renderer.render()
  }

  requestAnimationFrame(update)
}

requestAnimationFrame(update)

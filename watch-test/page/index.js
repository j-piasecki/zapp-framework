import { ZappWatch, ActivityIndicator } from '@zapp/watch'
import {
  Stack,
  StackConfig,
  StackAlignment,
  Config,
  Text,
  TextConfig,
  remember,
  sideEffect,
  withTiming,
  Column,
  Row,
  RowConfig,
  Alignment,
  Arrangement,
  EventManager,
  Easing,
} from '@zapp/core'

let cycle = [
  Arrangement.SpaceEvenly,
  Arrangement.SpaceBetween,
  Arrangement.Start,
  Arrangement.Center,
  Arrangement.End,
  Arrangement.SpaceAround,
]

Page({
  onInit() {
    ZappWatch.init()

    hmUI.setLayerScrolling(false)
    hmApp.registerGestureEvent(function (event) {
      return EventManager.hasCapturedPointers()
    })
  },
  build() {
    Stack(StackConfig('stack').fillSize().alignment(StackAlignment.Center).background(0x222222), () => {
      Column(Config('column').fillWidth(0.75).fillHeight(0.75).background(0xff0000).padding(10), () => {
        const weight = remember(1)
        sideEffect(() => {
          weight.value = withTiming(2, { duration: 3000, easing: Easing.easeOutQuad })
        })
        const background = remember(0x00ff00)
        Stack(
          StackConfig('row1')
            .fillWidth(1)
            .weight(1)
            .background(background.value)
            .alignment(StackAlignment.Center)
            .onPointerDown(() => {
              background.value = 0x00aa00
            })
            .onPointerUp(() => {
              background.value = 0x00ff00
            })
            .onPointerEnter(() => {
              background.value = 0x00aa00
            })
            .onPointerLeave(() => {
              background.value = 0x00ff00
            }),
          () => {
            const textVisible = remember(false)

            Stack(
              Config('wrapper')
                .padding(15)
                .background(0xff00ff)
                .onPointerDown(() => {
                  textVisible.value = !textVisible.value
                }),
              () => {
                if (textVisible.value) {
                  Text(TextConfig('text').textColor(0xffffff).textSize(24), 'Random text')
                } else {
                  ActivityIndicator('ac', 60, 0xff0000, 10)
                }
              }
            )
          }
        )

        const arrangement = remember(Arrangement.SpaceAround)

        Row(
          RowConfig('row2')
            .fillWidth(1)
            .weight(weight.value)
            .background(0x0000ff)
            .alignment(Alignment.Center)
            .arrangement(arrangement.value),
          () => {
            const start = remember({ x: 0, y: 0 })
            const offset = remember({ x: 0, y: 0 })
            Stack(Config('stack.1').fillHeight(0.3).width(40).background(0xff00ff))
            Stack(
              Config('stack.2')
                .fillHeight(0.6)
                .width(80)
                .background(0xffff00)
                .onPointerDown(() => {
                  const next = cycle.shift()
                  cycle.push(next)
                  arrangement.value = next
                })
            )
            Stack(
              Config('stack.3')
                .fillHeight(0.9)
                .width(120)
                .background(0x00ffff)
                .offset(offset.value.x, offset.value.y)
                .onPointerDown((e) => {
                  e.capture()
                  start.value = { x: e.x, y: e.y }
                })
                .onPointerMove((e) => {
                  offset.value = {
                    x: offset.value.x + e.x - start.value.x,
                    y: offset.value.y + e.y - start.value.y,
                  }
                  start.value = { x: e.x, y: e.y }
                })
            )
          }
        )
      })
    })
  },
  onDestroy() {
    ZappWatch.destroy()
    hmApp.unregisterGestureEvent()
  },
})

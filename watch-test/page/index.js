import '@zapp/watch'
import { ActivityIndicator, ActivityIndicatorConfig, Theme } from '@zapp/ui'
import {
  SimpleScreen,
  Stack,
  StackConfig,
  StackAlignment,
  Config,
  BareText,
  TextConfig,
  remember,
  sideEffect,
  withTiming,
  Column,
  Row,
  RowConfig,
  Alignment,
  Arrangement,
  Easing,
  ColumnConfig,
  ArcConfig,
  Navigator,
  registerCrownEventHandler,
  Image,
  ImageConfig,
} from '@zapp/core'

let cycle = [
  Arrangement.SpaceEvenly,
  Arrangement.SpaceBetween,
  Arrangement.Start,
  Arrangement.Center,
  Arrangement.End,
  Arrangement.SpaceAround,
]

SimpleScreen(Config('screen'), () => {
  Stack(StackConfig('stack').fillSize().alignment(StackAlignment.Center), () => {
    Column(ColumnConfig('column').fillWidth(0.75).fillHeight(0.75).background(0xff0000).padding(10), () => {
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
            Navigator.navigate('page/pager')
          })
          .onPointerEnter(() => {
            background.value = 0x00aa00
          })
          .onPointerLeave(() => {
            background.value = 0x00ff00
          }),
        () => {
          const textVisible = remember(false)
          const angle = remember(0)

          Stack(
            StackConfig('wrapper')
              .padding(15)
              .background(Theme.surface)
              .onPointerDown(() => {
                textVisible.value = !textVisible.value
                angle.value = 0
              }),
            () => {
              sideEffect(() => {
                if (!textVisible.value) {
                  angle.value = withTiming(360, { duration: 5000, easing: Easing.easeInOutCubic })
                }
              }, textVisible.value)

              if (!textVisible.value) {
                Image(
                  ImageConfig('img').width(80).height(80).origin(40, 40).innerOffset(8, 8).rotation(angle.value),
                  'zapp.png'
                )
              } else {
                ActivityIndicator(ActivityIndicatorConfig('ac').size(60).lineWidth(10))
              }
            }
          )
        }
      )

      const arrangement = remember(Arrangement.SpaceAround)
      const border = remember(0)

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
          Stack(
            StackConfig('stack.1')
              .fillHeight(0.3)
              .width(30)
              .background(0xff00ff)
              .borderWidth(10)
              .borderColor(0x00ff00)
              .onPointerDown(() => {
                Navigator.navigate('page/page1', { data: 'from home' })
              })
          )
          Stack(
            StackConfig('stack.2')
              .fillHeight(0.6)
              .width(60)
              .background(0xffff00)
              .borderWidth(border.value)
              .cornerRadius(30)
              .borderColor(0xaa5533)
              .onPointerDown(() => {
                const next = cycle.shift()
                cycle.push(next)
                arrangement.value = next

                if (border.value === 0) {
                  border.value = 10
                } else {
                  border.value = 0
                }
              })
          )
          Stack(
            StackConfig('stack.3')
              .fillHeight(0.9)
              .width(90)
              .background(0x00ffff)
              .borderWidth(10)
              .borderColor(0xffaa33)
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
})

import { ScrollableScreen, rememberScrollPosition } from '@zapp-framework/watch'
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
  registerGestureEventHandler,
} from '@zapp-framework/core'

ScrollableScreen(Config('screen'), (params) => {
  const scroll = rememberScrollPosition()

  Stack(StackConfig('stack').alignment(StackAlignment.TopEnd).fillSize(), () => {
    Column(
      ColumnConfig('column').fillWidth().alignment(Alignment.Center).background(0xaaaaff),
      () => {
        Stack(
          StackConfig('s1')
            .width(150)
            .height(150)
            .background(0xff0000)
            .onPointerDown(() => {
              scroll.value = withTiming(400, { duration: 1000, easing: Easing.easeInOutCubic })
            })
        )
        Stack(
          StackConfig('s2')
            .width(150)
            .height(150)
            .background(0x00ff00)
            .onPointerDown((e) => {
              console.log(e.x, e.y)
              Navigator.navigate('page/page3', { data: 'from green' })
            })
        )
        Stack(
          StackConfig('s3')
            .width(150)
            .height(150)
            .background(0x0000ff)
            .onPointerDown((e) => {
              console.log(e.x, e.y)
              Navigator.navigate('page/page3', { data: 'from blue' })
            })
        )
        Stack(
          StackConfig('s4')
            .width(150)
            .height(150)
            .background(0xff0000)
            .onPointerDown((e) => {
              console.log(e.x, e.y)
              Navigator.navigate('page/page3', { data: 'from red' })
            })
        )
        Stack(
          StackConfig('s5')
            .width(150)
            .height(150)
            .background(0x00ff00)
            .onPointerDown((e) => {
              console.log(e.x, e.y)
              Navigator.navigate('page/page3', { data: 'from green' })
            })
        )
        Stack(
          StackConfig('s6')
            .width(150)
            .height(150)
            .background(0x0000ff)
            .onPointerDown((e) => {
              console.log(e.x, e.y)
              Navigator.navigate('page/page3', { data: 'from blue' })
            })
        )
      }
    )

    Stack(
      StackConfig('floating')
        .width(30)
        .height(30)
        .cornerRadius(15)
        .background(0x000000)
        .offset(-10, 240 - hmApp.getLayerY())
    )
  })
})

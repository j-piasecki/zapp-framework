import '@zapp/watch'
import {
  SimpleScreen,
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
  Easing,
  ColumnConfig,
  ArcConfig,
  Navigator,
  registerGestureEventHandler,
} from '@zapp/core'

SimpleScreen(Config('screen'), (params) => {
  Column(
    ColumnConfig('stack')
      .fillSize()
      .alignment(Alignment.Center)
      .arrangement(Arrangement.SpaceEvenly)
      .background(0xff0000),
    () => {
      const lastGesture = remember('')

      registerGestureEventHandler((gesture) => {
        lastGesture.value = gesture
        return true
      })

      Text(TextConfig('text').textColor(0xffffff).textSize(40), `1, ${params.data}`)
      Text(TextConfig('text2').textColor(0xffffff).textSize(40), lastGesture.value)

      Stack(
        StackConfig('button1')
          .width(200)
          .height(50)
          .background(0xaaaaff)
          .onPointerDown(() => {
            Navigator.navigate('page/scrollable', { data: 'from 1' })
          })
      )

      Stack(
        StackConfig('button2')
          .width(200)
          .height(50)
          .background(0xaaaaaa)
          .onPointerDown(() => {
            Navigator.navigate('page/page2', { data: 'from 1' })
          })
      )

      Stack(
        StackConfig('button3')
          .width(200)
          .height(50)
          .background(0x000000)
          .onPointerDown(() => {
            Navigator.goBack()
          })
      )
    }
  )
})

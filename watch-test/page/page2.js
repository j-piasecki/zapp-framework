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
  registerHomeButtonEventHandler,
  registerShortcutButtonEventHandler,
} from '@zapp/core'

SimpleScreen(Config('screen'), (params) => {
  Column(
    ColumnConfig('stack')
      .fillSize()
      .alignment(Alignment.Center)
      .arrangement(Arrangement.SpaceEvenly)
      .background(0x00ff00),
    () => {
      const text = remember('')

      Text(TextConfig('text').textColor(0xffffff).textSize(40), `2, ${params.data}`)
      Text(TextConfig('text2').textColor(0xffffff).textSize(40), `${text.value}`)

      registerHomeButtonEventHandler({
        onClick: () => {
          text.value = 'home click'
          return true
        },
        onLongPress: () => {
          text.value = 'home longpress'
          return true
        },
      })

      registerShortcutButtonEventHandler({
        onClick: () => {
          text.value = 'shortcut click'
          return true
        },
        onLongPress: () => {
          text.value = 'shortcut longpress'
          return true
        },
      })

      Stack(
        StackConfig('button')
          .width(200)
          .height(50)
          .background(0xaaaaaa)
          .onPointerDown(() => {
            Navigator.navigate('page/page3', { data: 'from 2' })
          })
      )

      Stack(
        StackConfig('button2')
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

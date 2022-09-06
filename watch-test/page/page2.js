import { Navigator } from '@zapp/watch'
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
} from '@zapp/core'

SimpleScreen(Config('screen'), (params) => {
  Column(
    ColumnConfig('stack')
      .fillSize()
      .alignment(Alignment.Center)
      .arrangement(Arrangement.SpaceEvenly)
      .background(0x00ff00),
    () => {
      Text(TextConfig('text').textColor(0xffffff).textSize(40), `2, ${params.data}`)

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

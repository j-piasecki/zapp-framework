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
  Stack(
    StackConfig('stack')
      .fillSize()
      .alignment(StackAlignment.Center)
      .background(0x0000ff)
      .onPointerDown(() => {
        Navigator.goBack()
      }),
    () => {
      Text(TextConfig('text').textColor(0xffffff).textSize(40), `3, ${params.data}`)
    }
  )
})

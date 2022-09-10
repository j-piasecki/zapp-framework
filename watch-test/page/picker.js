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
} from '@zapp/core'

SimpleScreen(Config('screen'), (params) => {
  Stack(StackConfig('stack').fillSize().alignment(StackAlignment.Center).background(0x0000ff), () => {
    Column(ColumnConfig('wrapper').padding(60, 0).fillHeight().arrangement(Arrangement.SpaceEvenly), () => {
      Stack(
        StackConfig('btn1')
          .padding(10, 40)
          .background(0x666666)
          .cornerRadius(10)
          .onPointerUp(() => {
            Navigator.finishWithResult(1)
          }),
        () => {
          Text(TextConfig('text1').textColor(0xffffff).textSize(40), `Pick 1`)
        }
      )

      Stack(
        StackConfig('btn2')
          .padding(10, 40)
          .background(0x666666)
          .cornerRadius(10)
          .onPointerUp(() => {
            Navigator.finishWithResult(2)
          }),
        () => {
          Text(TextConfig('text2').textColor(0xffffff).textSize(40), `Pick 2`)
        }
      )

      Stack(
        StackConfig('btn3')
          .padding(10, 40)
          .background(0x666666)
          .cornerRadius(10)
          .onPointerUp(() => {
            Navigator.finishWithResult(3)
          }),
        () => {
          Text(TextConfig('text3').textColor(0xffffff).textSize(40), `Pick 3`)
        }
      )
    })
  })
})

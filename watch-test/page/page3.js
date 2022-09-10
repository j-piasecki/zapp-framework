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
  rememberLauncherForResult,
} from '@zapp/core'

SimpleScreen(Config('screen'), (params) => {
  const selectedNumber = remember(-1)
  const launcher = rememberLauncherForResult('page/picker', (result) => {
    selectedNumber.value = result
  })

  Stack(
    StackConfig('stack')
      .fillSize()
      .alignment(StackAlignment.Center)
      .background(0x0000ff)
      .onPointerUp(() => {
        launcher.launch()
      }),
    () => {
      Column(ColumnConfig('column'), () => {
        Text(TextConfig('text').textColor(0xffffff).textSize(40), `3, ${params.data}`)
        Text(TextConfig('text2').textColor(0xffffff).textSize(40), `Selected: ${selectedNumber.value}`)
      })
    }
  )
})

import '@zapp/watch'
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
  rememberLauncherForResult,
  registerCrownEventHandler,
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
      const height = remember(10)
      const targetHeight = remember(10)

      registerCrownEventHandler((delta) => {
        targetHeight.value = Math.max(10, targetHeight.value + delta * -1)
        height.value = withTiming(targetHeight.value, { easing: Easing.easeOutCubic })
        return true
      })

      Column(ColumnConfig('column2').alignment(Alignment.Center).arrangement(Arrangement.Center), () => {
        Stack(StackConfig('bar').width(50).height(height.value).background(0xff0000))
      })

      Column(ColumnConfig('column'), () => {
        BareText(TextConfig('text').textColor(0xffffff).textSize(40), `3, ${params.data}`)
        BareText(TextConfig('text2').textColor(0xffffff).textSize(40), `Selected: ${selectedNumber.value}`)
      })
    }
  )
})

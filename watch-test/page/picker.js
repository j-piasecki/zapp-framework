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
} from '@zapp/core'
import { Button, ButtonConfig, Text, RadioButton, RadioGroup, RadioGroupConfig } from '@zapp/ui'

SimpleScreen(Config('screen'), (params) => {
  Column(ColumnConfig('wrapper').fillSize().arrangement(Arrangement.Center).alignment(Alignment.Center), () => {
    const selected = remember(0)

    RadioGroup(
      RadioGroupConfig('radio')
        .selected(selected.value)
        .onChange((v) => {
          selected.value = v
        }),
      () => {
        Column(ColumnConfig('radiowrapper').padding(0, 0, 0, 24), () => {
          RadioButton(Config('radio1'), () => {
            Text(TextConfig('radio1text'), 'Item 1')
          })
          RadioButton(Config('radio2'), () => {
            Text(TextConfig('radio2text'), 'Item 2')
          })
          RadioButton(Config('radio3'), () => {
            Text(TextConfig('radio3text'), 'Item 3')
          })
        })
      }
    )

    Button(
      ButtonConfig('button').onPress(() => {
        Navigator.finishWithResult(selected.value + 1)
      }),
      () => {
        Text(TextConfig('buttontext'), 'Ok')
      }
    )
  })
})

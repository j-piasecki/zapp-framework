import { ScrollableScreen } from '@zapp/watch'
import { Config, Column, ColumnConfig, remember, ArcConfig, Stack, StackConfig, StackAlignment } from '@zapp/core'
import { ActivityIndicator } from '@zapp/ui'

ScrollableScreen(Config('screen'), () => {
  const availableStops = remember(null)

  if (availableStops.value === null) {
    Stack(StackConfig('wrapper').fillSize().alignment(StackAlignment.Center), () => {
      ActivityIndicator(ArcConfig('loading').width(50).height(50).lineWidth(10))
    })
  } else {
    Column(ColumnConfig('column').fillWidth().height(200).background(0xff0000))
  }
})

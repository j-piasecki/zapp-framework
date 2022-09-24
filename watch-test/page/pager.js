import { ScreenPager, PagerEntry, rememberCurrentPage, ScreenPagerConfig } from '@zapp/watch'
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
} from '@zapp/core'

ScreenPager(ScreenPagerConfig('screen', 3).startingPage(1), () => {
  PagerEntry(Config('page1'), () => {
    Stack(StackConfig('a'), () => {
      const page = rememberCurrentPage()
      console.log(page.value)
      Column(
        ColumnConfig('col1')
          .fillSize()
          .background(0xff0000)
          .onPointerUp((e) => {
            if (e.y < 100) {
              page.value = 2
            }
          })
      )
    })
  })

  PagerEntry(Config('page2'), () => {
    Column(ColumnConfig('col2').fillSize().background(0x00ff00))
  })

  PagerEntry(Config('page3'), () => {
    Column(
      ColumnConfig('col3')
        .fillSize()
        .onPointerUp((e) => {
          Navigator.navigate('page/page3')
        })
        .background(0x0000ff)
    )
  })
})

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
import { Button, ButtonConfig, PageIndicator, PageIndicatorConfig, Text } from '@zapp/ui'

function renderPageIndicator(current) {
  Stack(Config('indicatorContainer'), () => {
    const page = rememberCurrentPage()
    if (page.value === current) {
      PageIndicator(PageIndicatorConfig('indicator').numberOfPages(5).currentPage(page.value))
    }
  })
}

ScreenPager(ScreenPagerConfig('screen', 5).startingPage(2), () => {
  PagerEntry(Config('page1'), () => {
    Column(ColumnConfig('page1Column').fillSize().alignment(Alignment.Center).arrangement(Arrangement.Center), () => {
      Button(
        ButtonConfig('page1Button').onPress(() => {
          Navigator.navigate('page/page3')
        }),
        () => {
          Text(TextConfig('page1ButtonText'), 'Do stuff')
        }
      )
      Text(TextConfig('page1Text').textSize(80), '1')
    })

    renderPageIndicator(0)
  })

  PagerEntry(Config('page2'), () => {
    Column(ColumnConfig('page2Column').fillSize().alignment(Alignment.Center).arrangement(Arrangement.Center), () => {
      Button(
        ButtonConfig('page2Button').onPress(() => {
          Navigator.navigate('page/page3')
        }),
        () => {
          Text(TextConfig('page2ButtonText'), 'Do stuff')
        }
      )
      Text(TextConfig('page2Text').textSize(80), '2')
    })

    renderPageIndicator(1)
  })

  PagerEntry(Config('page3'), () => {
    Column(ColumnConfig('page3Column').fillSize().alignment(Alignment.Center).arrangement(Arrangement.Center), () => {
      Button(
        ButtonConfig('page3Button').onPress(() => {
          Navigator.navigate('page/page3')
        }),
        () => {
          Text(TextConfig('page3ButtonText'), 'Do stuff')
        }
      )
      Text(TextConfig('page3Text').textSize(80), '3')
    })

    renderPageIndicator(2)
  })

  PagerEntry(Config('page4'), () => {
    Column(ColumnConfig('page4Column').fillSize().alignment(Alignment.Center).arrangement(Arrangement.Center), () => {
      Button(
        ButtonConfig('page4Button').onPress(() => {
          Navigator.navigate('page/page3')
        }),
        () => {
          Text(TextConfig('page4ButtonText'), 'Do stuff')
        }
      )
      Text(TextConfig('page4Text').textSize(80), '4')
    })

    renderPageIndicator(3)
  })

  PagerEntry(Config('page5'), () => {
    Column(ColumnConfig('page5Column').fillSize().alignment(Alignment.Center).arrangement(Arrangement.Center), () => {
      Button(
        ButtonConfig('page5Button').onPress(() => {
          Navigator.navigate('page/page3')
        }),
        () => {
          Text(TextConfig('page5ButtonText'), 'Do stuff')
        }
      )
      Text(TextConfig('page5Text').textSize(80), '5')
    })

    renderPageIndicator(4)
  })
})

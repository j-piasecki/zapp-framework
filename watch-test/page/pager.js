import {
  ScreenPager,
  PagerEntry,
  rememberCurrentPage,
  ScreenPagerConfig,
  rememberSaveable,
} from '@zapp-framework/watch'
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
} from '@zapp-framework/core'
import {
  Button,
  ButtonConfig,
  PageIndicator,
  PageIndicatorConfig,
  Text,
  Switch,
  SwitchConfig,
} from '@zapp-framework/ui'

function renderPageIndicator(current) {
  PageIndicator(PageIndicatorConfig('indicator').numberOfPages(5).currentPage(current))
}

ScreenPager(ScreenPagerConfig('screen', 5).startingPage(2), () => {
  PagerEntry(Config('page1'), () => {
    Column(
      ColumnConfig('page1Column')
        .fillSize()
        .alignment(Alignment.Center)
        .arrangement(Arrangement.Center),
      () => {
        const isChecked = remember(true)
        Switch(
          SwitchConfig('switch')
            .isChecked(isChecked.value)
            .onChange((v) => {
              isChecked.value = v
            })
        )
        Text(TextConfig('page1Text').textSize(80), '1')
      }
    )

    renderPageIndicator(0)
  })

  PagerEntry(Config('page2'), () => {
    Column(
      ColumnConfig('page2Column')
        .fillSize()
        .alignment(Alignment.Center)
        .arrangement(Arrangement.Center),
      () => {
        const isChecked = remember(true)
        Switch(
          SwitchConfig('switch2')
            .isChecked(isChecked.value)
            .onChange((v) => {
              isChecked.value = v
            })
        )
        Text(TextConfig('page2Text').textSize(80), '2')
      }
    )

    renderPageIndicator(1)
  })

  PagerEntry(Config('page3'), () => {
    Column(
      ColumnConfig('page3Column')
        .fillSize()
        .alignment(Alignment.Center)
        .arrangement(Arrangement.Center),
      () => {
        Button(ButtonConfig('page3Button'), () => {
          Text(TextConfig('page3ButtonText'), 'Do stuff')
        })
        Text(TextConfig('page3Text').textSize(80), '3')
      }
    )

    renderPageIndicator(2)
  })

  PagerEntry(Config('page4'), () => {
    Column(
      ColumnConfig('page4Column')
        .fillSize()
        .alignment(Alignment.Center)
        .arrangement(Arrangement.Center),
      () => {
        const saved = rememberSaveable('number', 1)
        Button(
          ButtonConfig('page4Button').onPress(() => {
            Navigator.navigate('page/picker')
          }),
          () => {
            Text(TextConfig('page4ButtonText'), 'Do stuff')
          }
        )
        Text(TextConfig('page4Text').textSize(80), '4')
        Text(TextConfig('page4Text').textSize(20), `Picked number: ${saved.value}`)
      }
    )

    renderPageIndicator(3)
  })

  PagerEntry(Config('page5'), () => {
    Column(
      ColumnConfig('page5Column')
        .fillSize()
        .alignment(Alignment.Center)
        .arrangement(Arrangement.Center),
      () => {
        Button(
          ButtonConfig('page5Button').onPress(() => {
            Navigator.navigate('page/picker')
          }),
          () => {
            Text(TextConfig('page5ButtonText'), 'Do stuff')
          }
        )
        Text(TextConfig('page5Text').textSize(80), '5')
      }
    )

    renderPageIndicator(4)
  })
})

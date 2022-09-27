import { rememberSaveable, ScrollableScreen } from '@zapp/watch'
import {
  Config,
  Column,
  ColumnConfig,
  remember,
  ArcConfig,
  Stack,
  StackConfig,
  StackAlignment,
  sideEffect,
  Zapp,
  SimpleScreen,
  withTiming,
  TextConfig,
  Alignment,
  Row,
  RowConfig,
  Navigator,
} from '@zapp/core'
import { ActivityIndicator, ActivityIndicatorConfig, ButtonConfig, Text, Theme, Divider, DividerConfig } from '@zapp/ui'
import { Clickable } from '../components/Clickable'

function StopEntry(stop) {
  Clickable(
    ButtonConfig(`stop#${stop.name}`).onPress(() => {
      Navigator.navigate('page/stop', stop)
    }),
    () => {
      Row(
        RowConfig(`${stop.name}#wrapper`)
          .fillWidth()
          .padding(px(Zapp.screenWidth * 0.2), px(24), px(16), px(24)),
        () => {
          Text(TextConfig(`${stop.name}#name`), stop.name)
        }
      )
    }
  )
}

ScrollableScreen(Config('screen'), () => {
  const availableStops = rememberSaveable('followedStops', null)

  sideEffect((restoring) => {
    if (!restoring) {
      Zapp.getValue('message')
        .request({
          method: 'GET_STOPS',
        })
        .then((data) => {
          availableStops.value = data
        })
    }
    // availableStops.value = [{ name: 'Test' }]
  })

  Column(ColumnConfig('column').fillWidth().alignment(Alignment.Center).background(Theme.background), () => {
    if (availableStops.value === null) {
      Stack(StackConfig('loadingWrapper').fillSize().positionAbsolutely(true).alignment(StackAlignment.Center), () => {
        ActivityIndicator(ActivityIndicatorConfig('loading'))
      })
    } else if (availableStops.value.length === 0) {
      Stack(StackConfig('noStopsWrapper').fillHeight().fillWidth(0.7).alignment(StackAlignment.Center), () => {
        Column(ColumnConfig('lineBreak').alignment(Alignment.Center), () => {
          Text(TextConfig('noStopsText1').textColor(Theme.outline), 'Dodaj przystanki')
          Text(TextConfig('noStopsText2').textColor(Theme.outline), 'w ustawieniach')
        })
      })
    } else {
      Column(
        ColumnConfig('stopsWrapper')
          .padding(0, 0, 0, Zapp.screenHeight * 0.35)
          .fillWidth()
          .alignment(Alignment.Center),
        () => {
          Stack(
            StackConfig('header')
              .alignment(StackAlignment.BottomCenter)
              .padding(Zapp.screenWidth * 0.2, 0, Zapp.screenWidth * 0.2, px(8))
              .fillWidth()
              .height(Zapp.screenHeight * 0.4)
              .background(Theme.surface),
            () => {
              Text(TextConfig('header#text'), 'Obserwowane przystanki')
            }
          )

          for (let i = 0; i < availableStops.value.length; i++) {
            const stop = availableStops.value[i]

            StopEntry(stop)

            if (i < availableStops.value.length - 1) {
              Divider(DividerConfig(`divider#${i}`).fillWidth(0.8))
            }
          }
        }
      )
    }
  })
})

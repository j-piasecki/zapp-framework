import { gettext as getText } from 'i18n'
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
  Arrangement,
  ImageConfig,
  Image,
  ScreenShape,
} from '@zapp/core'
import { ActivityIndicator, ActivityIndicatorConfig, ButtonConfig, Text, Theme, Divider, DividerConfig } from '@zapp/ui'
import { Clickable } from '../components/Clickable'
import { REQUEST_STOPS_LIST } from '../shared/const'

function StopEntry(stop) {
  Clickable(
    ButtonConfig(`stop#${stop.name}`).onPress(() => {
      Navigator.navigate('page/stop', stop)
    }),
    () => {
      Row(
        RowConfig(`${stop.name}#wrapper`)
          .fillWidth()
          .padding(
            Zapp.screenShape === ScreenShape.Round ? Zapp.screenWidth * 0.15 : px(16),
            px(24),
            Zapp.screenShape === ScreenShape.Round ? Zapp.screenWidth * 0.1 : px(16),
            px(24)
          ),
        () => {
          Text(TextConfig(`${stop.name}#name`).textSize(px(40)), stop.name)
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
          method: REQUEST_STOPS_LIST,
        })
        .then((data) => {
          availableStops.value = data
        })
    }
  })

  Column(ColumnConfig('column').fillWidth().alignment(Alignment.Center).background(Theme.background), () => {
    if (availableStops.value === null) {
      Stack(StackConfig('loadingWrapper').fillSize().positionAbsolutely(true).alignment(StackAlignment.Center), () => {
        ActivityIndicator(ActivityIndicatorConfig('loading'))
      })
    } else if (availableStops.value.length === 0) {
      Stack(StackConfig('noStopsWrapper').fillHeight().fillWidth(0.7).alignment(StackAlignment.Center), () => {
        Text(TextConfig('noStopsText').textColor(Theme.outline).alignment(Alignment.Center), getText('noStops'))
      })
    } else {
      const connected = hmBle.connectStatus()
      Column(
        ColumnConfig('stopsWrapper')
          .padding(0, 0, 0, Zapp.screenHeight * 0.35)
          .fillWidth()
          .alignment(Alignment.Center),
        () => {
          Column(
            ColumnConfig('header')
              .alignment(Alignment.Center)
              .arrangement(connected ? Arrangement.End : Arrangement.SpaceBetween)
              .padding(
                Zapp.screenShape === ScreenShape.Round ? Zapp.screenWidth * 0.2 : px(24),
                Zapp.screenShape === ScreenShape.Round ? px(8) : Zapp.screenHeight * 0.15,
                Zapp.screenShape === ScreenShape.Round ? Zapp.screenWidth * 0.2 : px(24),
                px(8)
              )
              .fillWidth()
              .height(Zapp.screenShape === ScreenShape.Round ? Zapp.screenHeight * 0.35 : Zapp.screenHeight * 0.4)
              .background(Theme.surface),
            () => {
              if (!connected) {
                Image(ImageConfig('noConnection').width(32).height(32), 'no_connection.png')
              }

              Text(TextConfig('header#text').alignment(Alignment.Center).textSize(px(40)), getText('stopsHeader'))
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

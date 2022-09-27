import { ScrollableScreen } from '@zapp/watch'
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
} from '@zapp/core'
import { ActivityIndicator, ActivityIndicatorConfig, ButtonConfig, Divider, DividerConfig, Text, Theme } from '@zapp/ui'
import { Clickable } from '../components/Clickable'

function getDisplayedTime(time) {
  const minutes = Math.floor(time / 60)

  if (minutes === 0) {
    return '<1'
  } else if (minutes < 60) {
    return `${minutes}`
  } else {
    return '>60'
  }
}

function NumberMarker(id, number) {
  Stack(
    StackConfig(`${id}#border`)
      .alignment(StackAlignment.Center)
      .borderWidth(1)
      .borderColor(Theme.onSurface)
      .cornerRadius(px(8))
      .width(px(48)),
    () => {
      Text(TextConfig(`${id}#text`).textSize(px(20)).offset(0, -px(2)), `${number}`)
    }
  )
}

function RouteInfo(index, route) {
  Row(
    RowConfig(`wrapper#${index}`)
      .fillWidth()
      .padding(0, px(12), Zapp.screenWidth * 0.1, px(16))
      .alignment(Alignment.Center),
    () => {
      Stack(StackConfig(`stop#${index}#wrap`).fillWidth(0.25).alignment(StackAlignment.CenterEnd), () => {
        Text(TextConfig(`stop#${index}#time`).textSize(px(48)), getDisplayedTime(route.relativeTime))
      })

      Column(ColumnConfig(`stop#${index}#column`).alignment(Alignment.Center).padding(0, px(12)), () => {
        Text(TextConfig(`stop#${index}#unit`).textSize(px(24)).offset(0, -px(4)), 'min')
        NumberMarker(`stop#${index}#number`, route.number)
      })

      Stack(StackConfig('sdfsdf').weight(1), () => {
        Text(TextConfig(`stop#${index}#direction`).textSize(px(28)), route.direction)
      })
    }
  )
}

ScrollableScreen(Config('screen'), (params) => {
  const stopInfo = remember(null)

  sideEffect((restoring) => {
    if (!restoring) {
      // Zapp.getValue('message')
      //   .request({
      //     method: 'GET_STOP_DATA',
      //     data: params,
      //   })
      //   .then((data) => {
      //     stopInfo.value = data
      //   })
      stopInfo.value = [
        {
          relativeTime: 31,
          direction: 'Direction 1',
          number: 1,
          isLive: true,
        },
        {
          relativeTime: 61,
          direction: 'Direction 2',
          number: 2,
          isLive: true,
        },
        {
          relativeTime: 91,
          direction: 'Direction 1',
          number: 10,
          isLive: true,
        },
        {
          relativeTime: 121,
          direction: 'Direction 4',
          number: 512,
          isLive: true,
        },
        {
          relativeTime: 191,
          direction: 'a b c d e f g h i j k l m n o p q r s t u v w x y z',
          number: 9,
          isLive: true,
        },
        {
          relativeTime: 3601,
          direction: 'Dworzec Płaszów Estakada',
          number: 555,
          isLive: true,
        },
      ]
    }
  })

  Column(ColumnConfig('column').fillWidth().alignment(Alignment.Center).background(Theme.background), () => {
    if (stopInfo.value === null) {
      Stack(StackConfig('loadingWrapper').fillSize().positionAbsolutely(true).alignment(StackAlignment.Center), () => {
        ActivityIndicator(ActivityIndicatorConfig('loading'))
      })
    } else if (stopInfo.value.error) {
      Stack(StackConfig('errorWrapper').fillHeight().fillWidth(0.7).alignment(StackAlignment.Center), () => {
        Column(ColumnConfig('lineBreak').alignment(Alignment.Center), () => {
          Text(TextConfig('errorText').textColor(Theme.error), `Wystąpił błąd (${stopInfo.value.code})`)
        })
      })
    } else if (stopInfo.value.length === 0) {
      Stack(StackConfig('noResultWrapper').fillHeight().fillWidth(0.7).alignment(StackAlignment.Center), () => {
        Column(ColumnConfig('lineBreak').alignment(Alignment.Center), () => {
          Text(TextConfig('noResultText1').textColor(Theme.outline), 'Brak odjazdów w')
          Text(TextConfig('noResultText2').textColor(Theme.outline), 'najbliższym czasie')
        })
      })
    } else {
      Column(
        ColumnConfig('stopWrapper')
          .padding(Zapp.screenHeight * 0.35, 0)
          .alignment(Alignment.Center),
        () => {
          for (let i = 0; i < stopInfo.value.length; i++) {
            const item = stopInfo.value[i]

            RouteInfo(i, item)

            if (i < stopInfo.value.length - 1) {
              Divider(DividerConfig(`divider#${i}`).fillWidth(0.8))
            }
          }
        }
      )
    }
  })
})

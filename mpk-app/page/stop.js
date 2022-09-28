import { gettext as getText } from 'i18n'
import { ScrollableScreen } from '@zapp-framework/watch'
import {
  Config,
  Column,
  ColumnConfig,
  remember,
  Stack,
  StackConfig,
  StackAlignment,
  sideEffect,
  Zapp,
  TextConfig,
  Alignment,
  Row,
  RowConfig,
  Color,
  Arrangement,
  Navigator,
  ScreenShape,
} from '@zapp-framework/core'
import {
  ActivityIndicator,
  ActivityIndicatorConfig,
  Button,
  ButtonConfig,
  Divider,
  DividerConfig,
  Text,
  Theme,
} from '@zapp-framework/ui'
import { REQUEST_STOP_DEPARTURES } from '../shared/const'

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

function NumberMarker(id, number, departed) {
  const color = departed ? Color.shade(Theme.primary, 0.25) : Theme.primary
  Stack(
    StackConfig(`${id}#border`)
      .alignment(StackAlignment.Center)
      .borderWidth(2)
      .borderColor(color)
      .cornerRadius(px(12))
      .width(px(52)),
    () => {
      Text(
        TextConfig(`${id}#text`).textColor(color).textSize(px(26)).offset(px(1), -px(2)),
        `${number}`
      )
    }
  )
}

function RouteInfo(index, route) {
  Row(
    RowConfig(`wrapper#${index}`)
      .fillWidth()
      .padding(0, px(12), px(16), px(16))
      .alignment(Alignment.Center),
    () => {
      const departed = route.relativeTime < 0
      const textColor = departed ? Theme.outline : Theme.onBackground
      const secondaryColor = departed ? Color.shade(Theme.secondary, 0.25) : Theme.secondary

      Stack(
        StackConfig(`stop#${index}#wrap`).fillWidth(0.25).alignment(StackAlignment.CenterEnd),
        () => {
          Text(
            TextConfig(`stop#${index}#time`).textSize(px(66)).textColor(textColor),
            getDisplayedTime(route.relativeTime)
          )
        }
      )

      Column(
        ColumnConfig(`stop#${index}#column`).alignment(Alignment.Center).padding(0, px(12)),
        () => {
          Text(
            TextConfig(`stop#${index}#unit`)
              .textColor(secondaryColor)
              .textSize(px(22))
              .offset(0, -px(4)),
            getText('minuteUnit')
          )
          NumberMarker(`stop#${index}#number`, route.number, departed)
        }
      )

      Stack(StackConfig('sdfsdf').weight(1), () => {
        Text(
          TextConfig(`stop#${index}#direction`).textColor(textColor).textSize(px(28)),
          route.direction
        )
      })
    }
  )
}

ScrollableScreen(Config('screen'), (params) => {
  const departures = remember(null)
  const departuresToRenderCount = remember(0)

  sideEffect((restoring) => {
    if (!restoring) {
      if (hmBle.connectStatus()) {
        Zapp.getValue('message')
          .request({
            method: REQUEST_STOP_DEPARTURES,
            data: params,
          })
          .then((data) => {
            departures.value = data

            // render only 4 entries at first so it's quicker
            departuresToRenderCount.value = Math.min(4, data.length)
          })
      } else {
        departures.value = { error: true, code: -1, message: getText('noConnection') }
      }
    }
  })

  Column(
    ColumnConfig('column').fillWidth().alignment(Alignment.Center).background(Theme.background),
    () => {
      if (departures.value === null) {
        Stack(
          StackConfig('loadingWrapper')
            .fillSize()
            .positionAbsolutely(true)
            .alignment(StackAlignment.Center),
          () => {
            ActivityIndicator(ActivityIndicatorConfig('loading'))
          }
        )
      } else if (departures.value.error) {
        Column(
          ColumnConfig('errorWrapper')
            .fillHeight()
            .fillWidth(0.7)
            .alignment(Alignment.Center)
            .arrangement(Arrangement.Center),
          () => {
            Text(
              TextConfig('errorText').textColor(Theme.error).alignment(Alignment.Center),
              departures.value.message ?? `${getText('error')} (${departures.value.code})`
            )

            Stack(Config('spacer').height(px(24)))

            Button(
              ButtonConfig('errorOk').onPress(() => {
                Navigator.goBack()
              }),
              () => {
                Text(TextConfig('okText'), getText('ok'))
              }
            )
          }
        )
      } else {
        Column(
          ColumnConfig('stopsWrapper')
            .padding(0, 0, 0, Zapp.screenHeight * 0.35)
            .alignment(Alignment.Center),
          () => {
            Stack(
              StackConfig('header')
                .alignment(StackAlignment.BottomCenter)
                .padding(
                  Zapp.screenShape === ScreenShape.Round ? Zapp.screenWidth * 0.2 : px(24),
                  px(8),
                  Zapp.screenShape === ScreenShape.Round ? Zapp.screenWidth * 0.2 : px(24),
                  px(8)
                )
                .fillWidth()
                .height(
                  Zapp.screenShape === ScreenShape.Round
                    ? Zapp.screenHeight * 0.35
                    : Zapp.screenHeight * 0.4
                )
                .background(Theme.surface),
              () => {
                Text(TextConfig('header#text').alignment(Alignment.Center), params.name)
              }
            )

            if (departures.value.length === 0) {
              Stack(
                StackConfig('noResultTextWrapper')
                  .offset(0, px(24))
                  .fillWidth(0.7)
                  .alignment(StackAlignment.Center),
                () => {
                  Text(
                    TextConfig('noResultText').textColor(Theme.outline).alignment(Alignment.Center),
                    getText('noDepartures')
                  )
                }
              )
            } else {
              for (let i = 0; i < departuresToRenderCount.value; i++) {
                const item = departures.value[i]

                RouteInfo(i, item)

                if (i < departuresToRenderCount.value - 1) {
                  Divider(DividerConfig(`divider#${i}`).fillWidth(0.8))
                }
              }
            }

            sideEffect(() => {
              // after first render, all
              departuresToRenderCount.value = departures.value.length
            })
          }
        )
      }
    }
  )
})

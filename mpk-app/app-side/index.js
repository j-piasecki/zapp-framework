import { gettext as getText } from 'i18n'
import { MessageBuilder } from '../shared/message'
import { REQUEST_STOPS_LIST, REQUEST_STOP_DEPARTURES } from '../shared/const'

const messageBuilder = new MessageBuilder()

function getStops() {
  return settings.settingsStorage.getItem('stops') ? JSON.parse(settings.settingsStorage.getItem('stops')) : []
}

function saveStops(stops) {
  settings.settingsStorage.setItem('stops', JSON.stringify(stops))
}

async function fetchStopData(ctx, data) {
  if (data.id === undefined) {
    const response = await fetch({
      url:
        'http://www.ttss.krakow.pl/internetservice/services/lookup/autocomplete/json?query=' +
        encodeURIComponent(data.name),
      method: 'GET',
    })

    if (response.status !== 200) {
      ctx.response({
        data: { error: true, code: 1, message: `${getText('ttssConnectionError')} (${response.status})` },
      })
      return
    }

    const route = JSON.parse(response.body)

    if (!Array.isArray(route) || route.length < 2) {
      ctx.response({ data: { error: true, code: 2, message: getText('incorrectStopName') } })
    } else {
      const stopInfo = route.splice(1).sort((a, b) => a.name.length - b.name.length)[0]
      data.id = stopInfo.id
      data.name = stopInfo.name
      const stops = getStops()
      for (let i = 0; i < stops.length; i++) {
        if (stops[i].name === data.name) {
          stops[i].id = data.id
          break
        }
      }
      saveStops(stops)
    }
  }

  const response = await fetch({
    url: `http://www.ttss.krakow.pl/internetservice/services/passageInfo/stopPassages/stop?stop=${data.id}&mode=departure`,
    method: 'GET',
  })

  if (response.status !== 200) {
    ctx.response({ data: { error: true, code: 3, message: `${getText('ttssConnectionError')} (${response.status})` } })
    return
  }
  try {
    const json = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
    const result = json.actual.slice(0, 10).map((item) => {
      return {
        relativeTime: item.actualRelativeTime,
        direction: item.direction,
        number: item.patternText,
        isLive: true,
      }
    })

    ctx.response({ data: result })
  } catch (e) {
    ctx.response({ data: { error: true, code: 4 } })
  }
}

AppSideService({
  onInit() {
    messageBuilder.listen(() => {})

    messageBuilder.on('request', (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload)
      if (jsonRpc.method === REQUEST_STOPS_LIST) {
        ctx.response({ data: getStops() })
      } else if (jsonRpc.method === REQUEST_STOP_DEPARTURES) {
        fetchStopData(ctx, jsonRpc.data)
      }
    })
  },

  onRun() {},

  onDestroy() {},
})

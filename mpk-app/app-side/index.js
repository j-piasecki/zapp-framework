import { MessageBuilder } from '../shared/message'

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
      ctx.response({ data: { error: true, code: 1 } })
      return
    }

    const route = JSON.parse(response.body)

    if (!Array.isArray(route) || route.length < 2) {
      ctx.response({ data: { error: true, code: 2 } })
    } else {
      data.id = route[1].id
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
    ctx.response({ data: { error: true, code: 3 } })
    return
  }
  const json = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
  const result = json.actual.slice(0, 10).map((item) => {
    return { relativeTime: item.actualRelativeTime, direction: item.direction, number: item.patternText, isLive: true }
  })

  ctx.response({ data: result })
}

AppSideService({
  onInit() {
    messageBuilder.listen(() => {})

    messageBuilder.on('request', (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload)
      if (jsonRpc.method === 'GET_STOPS') {
        ctx.response({ data: getStops() })
      } else if (jsonRpc.method === 'GET_STOP_DATA') {
        fetchStopData(ctx, jsonRpc.data)
      }
    })
  },

  onRun() {},

  onDestroy() {},
})
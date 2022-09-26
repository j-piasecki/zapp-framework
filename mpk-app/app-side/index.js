import { MessageBuilder } from '../shared/message'

const messageBuilder = new MessageBuilder()

function getStops() {
  return settings.settingsStorage.getItem('stops') ? JSON.parse(settings.settingsStorage.getItem('stops')) : []
}

const fetchData = async (ctx) => {
  try {
    // Requesting network data using the fetch API
    // The sample program is for simulation only and does not request real network data, so it is commented here
    // Example of a GET method request
    // const { body: { data = {} } = {} } = await fetch({
    //   url: 'https://xxx.com/api/xxx',
    //   method: 'GET'
    // })
    // Example of a POST method request
    // const { body: { data = {} } = {} } = await fetch({
    //   url: 'https://xxx.com/api/xxx',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     text: 'Hello Zepp OS'
    //   })
    // })

    // A network request is simulated here
    const data = {
      text: 'test',
    }

    ctx.response({
      data: { result: data },
    })
  } catch (error) {
    ctx.response({
      data: { result: 'ERROR' },
    })
  }
}

AppSideService({
  onInit() {
    messageBuilder.listen(() => {})

    messageBuilder.on('request', (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload)
      if (jsonRpc.method === 'GET_STOPS') {
        ctx.response({ data: getStops() })
      }
    })
  },

  onRun() {},

  onDestroy() {},
})

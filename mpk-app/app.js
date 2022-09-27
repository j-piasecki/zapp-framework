import './shared/device-polyfill'
import '@zapp/watch'
import { Application, Zapp } from '@zapp/core'
import { setTheme } from '@zapp/ui'
import { MessageBuilder } from './shared/message'

const appId = 23920
const messageBuilder = new MessageBuilder({ appId })

Application({
  onInit() {
    setTheme()
    Zapp.setValue('message', messageBuilder)

    messageBuilder.connect()
  },
  onDestroy() {
    messageBuilder.disConnect()
  },
})

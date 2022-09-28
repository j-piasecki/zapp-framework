import './shared/device-polyfill'
import '@zapp-framework/watch'
import { Application, Zapp } from '@zapp-framework/core'
import { setTheme } from '@zapp-framework/ui'
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

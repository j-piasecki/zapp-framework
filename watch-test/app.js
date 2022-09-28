import '@zapp-framework/watch'
import { setTheme } from '@zapp-framework/ui'
import { Application } from '@zapp-framework/core'

Application({
  onInit() {
    setTheme()
  },
})

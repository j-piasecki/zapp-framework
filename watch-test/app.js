import '@zapp/watch'
import { setTheme } from '@zapp/ui'
import { Application } from '@zapp/core'

Application({
  onInit() {
    setTheme()
  },
})

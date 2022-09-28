import { Config, Row, Stack, StackConfig, SimpleScreen, StackAlignment, RowConfig } from '@zapp-framework/core'
import { NavBar, RouteInfo } from './NavBar'

export function Page(routes: RouteInfo[], content: () => void) {
  SimpleScreen(Config('screen'), () => {
    Row(RowConfig('navbar-container').fillSize().background(0x000000), () => {
      NavBar(routes)
      Stack(StackConfig('content').weight(1).fillHeight().alignment(StackAlignment.Center), content)
    })
  })
}

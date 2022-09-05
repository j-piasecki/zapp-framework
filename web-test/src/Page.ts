import { Config, Row, Stack, StackConfig, Screen, StackAlignment, RowConfig } from '@zapp/core'
import { NavBar, RouteInfo } from './NavBar'

export function Page(routes: RouteInfo[], content: () => void) {
  Screen(Config('screen'), () => {
    Row(RowConfig('navbar-container').fillSize().background(0x000000), () => {
      NavBar(routes)
      Stack(StackConfig('content').weight(1).fillHeight().alignment(StackAlignment.Center), content)
    })
  })
}

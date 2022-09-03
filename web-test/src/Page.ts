import { Config, Row, Stack, StackConfig, Screen, StackAlignment } from '@zapp/core'
import { NavBar, RouteInfo } from './NavBar'

export function Page(routes: RouteInfo[], content: () => void) {
  Screen(Config('screen').background(0x000000), () => {
    Row(Config('navbar-container').fillSize(), () => {
      NavBar(routes)
      Stack(StackConfig('content').weight(1).fillHeight().alignment(StackAlignment.Center), content)
    })
  })
}

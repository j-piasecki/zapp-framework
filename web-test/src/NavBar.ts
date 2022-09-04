import { Column, Config, Stack, StackAlignment, StackConfig, Text, TextConfig, Custom, remember } from '@zapp/core'
import { HashNavigator } from '@zapp/web'

function NavButton(text: string, route: string) {
  Custom(Config(`wrapperbutton#${route}`).padding(5, 0), {}, () => {
    const defaultColor = route === HashNavigator.currentRoute ? 0x555555 : 0x333333
    const pressedColor = route === HashNavigator.currentRoute ? 0x666666 : 0x444444

    const pressed = remember(false)
    const background = remember(defaultColor)

    Stack(
      StackConfig(`button#${route}`)
        .alignment(StackAlignment.CenterStart)
        .fillWidth(1)
        .padding(10, 20)
        .background(background.value)
        .cornerRadius(10)
        .onPointerDown(() => {
          pressed.value = true
          background.value = pressedColor
        })
        .onPointerUp(() => {
          if (pressed.value) {
            pressed.value = false
            background.value = defaultColor

            HashNavigator.navigate(route)
          }
        })
        .onPointerLeave(() => {
          pressed.value = false
          background.value = defaultColor
        }),
      () => {
        Text(TextConfig(`buttontext#${route}`).textColor(0xffffff).textSize(20), text)
      }
    )
  })
}

export interface RouteInfo {
  displayName: string
  routeName: string
}

export function NavBar(routes: RouteInfo[]) {
  Column(Config('nav-bar').fillHeight().width(300).background(0x222222).padding(10), () => {
    for (const { displayName, routeName } of routes) {
      NavButton(displayName, routeName)
    }
  })
}
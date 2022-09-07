import {
  Column,
  Stack,
  StackAlignment,
  StackConfig,
  Text,
  TextConfig,
  Custom,
  remember,
  ColumnConfig,
  Navigator,
} from '@zapp/core'

function NavButton(text: string, route: string) {
  Custom(ColumnConfig(`wrapperbutton#${route}`).padding(5, 0), {}, () => {
    const defaultColor = route === Navigator.currentPage ? 0x555555 : 0x333333
    const pressedColor = route === Navigator.currentPage ? 0x666666 : 0x444444

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

            Navigator.navigate(route, { from: Navigator.currentPage })
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
  Column(ColumnConfig('nav-bar').fillHeight().width(300).background(0x222222).padding(10), () => {
    for (const { displayName, routeName } of routes) {
      NavButton(displayName, routeName)
    }
  })
}

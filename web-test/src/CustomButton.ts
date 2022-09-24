import { Custom, remember, Stack, StackConfig, StackAlignment, TextConfig, Text, ColumnConfig } from '@zapp/core'
import { ConfigBuilder } from '@zapp/core/build/working_tree/props/Config'

export function CustomButton(config: ConfigBuilder, text: string, onClick: () => void) {
  const id = config.build().id
  Custom(ColumnConfig(`${id}#wrapper`).padding(10), {}, () => {
    const defaultColor = 0x333333
    const pressedColor = 0x444444

    const pressed = remember(false)
    const background = remember(defaultColor)

    Stack(
      StackConfig(`${id}#background`)
        .alignment(StackAlignment.CenterStart)
        .padding(10, 20)
        .background(background.value)
        .cornerRadius(10)
        .merge(config)
        .onPointerDown(() => {
          pressed.value = true
          background.value = pressedColor
        })
        .onPointerUp(() => {
          if (pressed.value) {
            pressed.value = false
            background.value = defaultColor

            onClick()
          }
        })
        .onPointerLeave(() => {
          pressed.value = false
          background.value = defaultColor
        }),
      () => {
        Text(TextConfig(`${id}#text`).textColor(0xffffff).textSize(20), text)
      }
    )
  })
}

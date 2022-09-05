import { Config, Custom, remember, RenderNode, sideEffect, Stack, withTiming } from '@zapp/core'

// TODO: custom config builder
export function ActivityIndicator(id: string, radius: number, color: number, lineWidth: number) {
  Stack(Config(`${id}#wrapper`), () => {
    const angle = remember(-90)
    const size = remember(10)

    function animateCycle() {
      angle.value = -90
      angle.value = withTiming(270, {
        duration: 1000,
        onEnd: (completed) => {
          if (completed) {
            animateCycle()
          }
        },
      })
      size.value = withTiming(120, {
        duration: 500,
        onEnd: (completed) => {
          if (completed) {
            size.value = withTiming(10, { duration: 500 })
          }
        },
      })
    }

    sideEffect(animateCycle)

    Custom(Config(id).width(radius).height(radius), {
      createView(config: RenderNode) {
        return hmUI.createWidget(hmUI.widget.ARC, {
          x: config.layout.x,
          y: config.layout.y,
          w: config.layout.width,
          h: config.layout.height,
          start_angle: angle.value,
          end_angle: angle.value + size.value,
          color: color,
          line_width: lineWidth,
        })
      },
      updateView(_: RenderNode, next: RenderNode, view: any) {
        view.setProperty(hmUI.prop.MORE, {
          x: next.layout.x,
          y: next.layout.y,
          w: next.layout.width,
          h: next.layout.height,
          start_angle: angle.value,
          end_angle: angle.value + size.value,
          color: color,
          line_width: lineWidth,
        })
      },
    })
  })
}

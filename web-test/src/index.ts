import { HashNavigator } from '@zapp/web'
import {
  WorkingTree,
  Animation,
  Renderer,
  Screen,
  Config,
  TextConfig,
  Column,
  Row,
  Text,
  remember,
  sideEffect,
  withTiming,
  EventManager,
  Stack,
  StackConfig,
  StackAlignment,
  ColumnConfig,
  Alignment,
  Arrangement,
  RowConfig,
  Easing,
  Arc,
  ArcConfig,
  Zapp,
} from '@zapp/core'
import { NavBar, RouteInfo } from './NavBar'
import { Page } from './Page'
import { Button } from './Button'

Zapp.startLoop()

const routesInfo: RouteInfo[] = [
  { displayName: 'Dynamic layout example', routeName: 'dynamicLayout' },
  { displayName: 'Stack example', routeName: 'stack' },
  { displayName: 'Column example', routeName: 'column' },
  { displayName: 'Row example', routeName: 'row' },
  { displayName: 'Animation example', routeName: 'animation' },
]

function StackExample() {
  Page(routesInfo, () => {
    const alignment = remember(StackAlignment.Center)

    Column(ColumnConfig('stack-example').alignment(Alignment.Center).arrangement(Arrangement.Center).fillSize(), () => {
      Column(ColumnConfig('align-chooser').alignment(Alignment.Center).padding(0, 0, 0, 50), () => {
        Row(Config('align-chooser-top'), () => {
          Button(Config('btn-alignment-topstart'), 'TopStart', () => {
            alignment.value = StackAlignment.TopStart
          })
          Button(Config('btn-alignment-topcenter'), 'TopCenter', () => {
            alignment.value = StackAlignment.TopCenter
          })
          Button(Config('btn-alignment-topend'), 'TopEnd', () => {
            alignment.value = StackAlignment.TopEnd
          })
        })

        Row(Config('align-chooser-center'), () => {
          Button(Config('btn-alignment-centerstart'), 'CenterStart', () => {
            alignment.value = StackAlignment.CenterStart
          })
          Button(Config('btn-alignment-center'), 'Center', () => {
            alignment.value = StackAlignment.Center
          })
          Button(Config('btn-alignment-centerend'), 'CenterEnd', () => {
            alignment.value = StackAlignment.CenterEnd
          })
        })

        Row(Config('align-chooser-bottom'), () => {
          Button(Config('btn-alignment-bottomstart'), 'BottomStart', () => {
            alignment.value = StackAlignment.BottomStart
          })
          Button(Config('btn-alignment-bottomcenter'), 'BottomCenter', () => {
            alignment.value = StackAlignment.BottomCenter
          })
          Button(Config('btn-alignment-bottomend'), 'BottomEnd', () => {
            alignment.value = StackAlignment.BottomEnd
          })
        })
      })

      Stack(
        StackConfig('stack').alignment(alignment.value).background(0xff0000).width(350).height(350).padding(10),
        () => {
          Stack(
            StackConfig('innerstack.1')
              .width(200)
              .height(200)
              .background(0x00ff00)
              .borderWidth(10)
              .borderColor(0xff00ff)
          )
          Stack(
            StackConfig('innerstack.2')
              .width(100)
              .height(100)
              .background(0x0000ff)
              .borderWidth(10)
              .borderColor(0xffff00)
          )
        }
      )
    })
  })
}

function ColumnExample() {
  Page(routesInfo, () => {
    const alignment = remember(Alignment.Start)
    const arrangement = remember(Arrangement.Start)

    Column(
      ColumnConfig('column-example')
        .alignment(Alignment.Center)
        .arrangement(Arrangement.Center)
        .fillSize()
        .padding(50, 0),
      () => {
        Text(TextConfig('align-header').textColor(0xffffff).textSize(24), 'Alignment')
        Row(RowConfig('align-chooser').padding(0, 0, 0, 25), () => {
          Button(Config('btn-alignment-topstart'), 'Start', () => {
            alignment.value = Alignment.Start
          })
          Button(Config('btn-alignment-topcenter'), 'Center', () => {
            alignment.value = Alignment.Center
          })
          Button(Config('btn-alignment-topend'), 'End', () => {
            alignment.value = Alignment.End
          })
        })

        Text(TextConfig('arrange-header').textColor(0xffffff).textSize(24), 'Arrangement')
        Row(Config('arrangement-chooser-one'), () => {
          Button(Config('btn-arrangement-start'), 'Start', () => {
            arrangement.value = Arrangement.Start
          })
          Button(Config('btn-arrangement-center'), 'Center', () => {
            arrangement.value = Arrangement.Center
          })
          Button(Config('btn-arrangement-end'), 'End', () => {
            arrangement.value = Arrangement.End
          })
        })

        Row(RowConfig('arrangement-chooser-two').padding(0, 0, 0, 70), () => {
          Button(Config('btn-arrangement-between'), 'SpaceBetween', () => {
            arrangement.value = Arrangement.SpaceBetween
          })
          Button(Config('btn-arrangement-around'), 'SpaceAround', () => {
            arrangement.value = Arrangement.SpaceAround
          })
          Button(Config('btn-arrangement-evenly'), 'SpaceEvenly', () => {
            arrangement.value = Arrangement.SpaceEvenly
          })
        })

        Column(
          ColumnConfig('column')
            .alignment(alignment.value)
            .arrangement(arrangement.value)
            .background(0xff0000)
            .width(500)
            .weight(1)
            .padding(10),
          () => {
            Stack(
              StackConfig('innerstack.1')
                .width(70)
                .height(80)
                .background(0x00ff00)
                .borderWidth(10)
                .borderColor(0x00ffff)
            )
            Stack(
              StackConfig('innerstack.2')
                .width(140)
                .height(100)
                .background(0x0000ff)
                .borderWidth(10)
                .borderColor(0xffaaff)
            )
            Stack(
              StackConfig('innerstack.3')
                .width(210)
                .height(120)
                .background(0xff00ff)
                .borderWidth(10)
                .borderColor(0x00ff99)
            )
          }
        )
      }
    )
  })
}

function RowExample() {
  Page(routesInfo, () => {
    const alignment = remember(Alignment.Start)
    const arrangement = remember(Arrangement.Start)

    Column(
      ColumnConfig('row-example').alignment(Alignment.Center).arrangement(Arrangement.Center).fillSize().padding(50, 0),
      () => {
        Text(TextConfig('align-header').textColor(0xffffff).textSize(24), 'Alignment')
        Row(RowConfig('align-chooser').padding(0, 0, 0, 25), () => {
          Button(Config('btn-alignment-topstart'), 'Start', () => {
            alignment.value = Alignment.Start
          })
          Button(Config('btn-alignment-topcenter'), 'Center', () => {
            alignment.value = Alignment.Center
          })
          Button(Config('btn-alignment-topend'), 'End', () => {
            alignment.value = Alignment.End
          })
        })

        Text(TextConfig('arrange-header').textColor(0xffffff).textSize(24), 'Arrangement')
        Row(Config('arrangement-chooser-one'), () => {
          Button(Config('btn-arrangement-start'), 'Start', () => {
            arrangement.value = Arrangement.Start
          })
          Button(Config('btn-arrangement-center'), 'Center', () => {
            arrangement.value = Arrangement.Center
          })
          Button(Config('btn-arrangement-end'), 'End', () => {
            arrangement.value = Arrangement.End
          })
        })

        Row(RowConfig('arrangement-chooser-two').padding(0, 0, 0, 70), () => {
          Button(Config('btn-arrangement-between'), 'SpaceBetween', () => {
            arrangement.value = Arrangement.SpaceBetween
          })
          Button(Config('btn-arrangement-around'), 'SpaceAround', () => {
            arrangement.value = Arrangement.SpaceAround
          })
          Button(Config('btn-arrangement-evenly'), 'SpaceEvenly', () => {
            arrangement.value = Arrangement.SpaceEvenly
          })
        })

        Row(
          RowConfig('row')
            .alignment(alignment.value)
            .arrangement(arrangement.value)
            .background(0xff0000)
            .width(500)
            .weight(1)
            .padding(10),
          () => {
            Stack(
              StackConfig('innerstack.1')
                .width(80)
                .height(70)
                .background(0x00ff00)
                .borderWidth(10)
                .borderColor(0x00ffff)
            )
            Stack(
              StackConfig('innerstack.2')
                .width(100)
                .height(140)
                .background(0x0000ff)
                .borderWidth(10)
                .borderColor(0xffaaff)
            )
            Stack(
              StackConfig('innerstack.3')
                .width(120)
                .height(210)
                .background(0xff00ff)
                .borderWidth(10)
                .borderColor(0x00ff99)
            )
          }
        )
      }
    )
  })
}

function AnimationExample() {
  Page(routesInfo, () => {
    Column(
      ColumnConfig('animation-example')
        .alignment(Alignment.Center)
        .arrangement(Arrangement.Center)
        .fillSize()
        .padding(50, 0),
      () => {
        const x = remember(-250)
        const target = remember(250)
        const easing = remember(Easing.linear)

        Row(Config('animation-chooser-one'), () => {
          Button(Config('btn-animation-linear'), 'Linear', () => {
            easing.value = Easing.linear
          })
          Button(Config('btn-animation-ease'), 'Ease', () => {
            easing.value = Easing.ease
          })
        })
        Row(Config('animation-chooser-two'), () => {
          Button(Config('btn-animation-inquad'), 'EaseInQuad', () => {
            easing.value = Easing.easeInQuad
          })
          Button(Config('btn-animation-outquad'), 'EaseOutQuad', () => {
            easing.value = Easing.easeOutQuad
          })
          Button(Config('btn-animation-inoutquad'), 'EaseInOutQuad', () => {
            easing.value = Easing.easeInOutQuad
          })
        })
        Row(RowConfig('animation-chooser-three').padding(0, 0, 0, 70), () => {
          Button(Config('btn-animation-incubic'), 'EaseInCubic', () => {
            easing.value = Easing.easeInCubic
          })
          Button(Config('btn-animation-outcubic'), 'EaseOutCubic', () => {
            easing.value = Easing.easeOutCubic
          })
          Button(Config('btn-animation-inoutcubic'), 'EaseInOutCubic', () => {
            easing.value = Easing.easeInOutCubic
          })
        })
        Stack(RowConfig('stack').width(100).height(100).background(0x00ff00).offset(x.value, 0))
        Stack(Config('spacer').height(50))
        Button(Config('btn-animate'), 'Animate', () => {
          x.value = withTiming(target.value, { easing: easing.value, duration: 1000 })
          target.value = target.value * -1
        })
      }
    )
  })
}

function DynamicLayoutExample() {
  Page(routesInfo, () => {
    const padding = remember(0)
    const start = remember({ x: 0, y: 0 })
    const position = remember({ x: 0, y: 0 })

    sideEffect(() => {
      padding.value = withTiming(100, { duration: 2000 })
    })

    Column(ColumnConfig('col').fillSize().padding(padding.value).background(0x000000), () => {
      const weight = remember(2)
      const size = remember(50)

      sideEffect(() => {
        weight.value = withTiming(1, { duration: 3000 })
        size.value = withTiming(200, { duration: 3000 })
      })

      Row(Config('row1').fillWidth(1).weight(1), () => {
        const start = remember(-90)
        const size = remember(0)

        sideEffect(() => {
          start.value = withTiming(270, { duration: 1000 })
          size.value = withTiming(120, {
            duration: 400,
            onEnd: () => {
              size.value = withTiming(0, { duration: 600 })
            },
          })
        })
        Row(RowConfig('row1.1').fillHeight(1).weight(1).background(0xff0000), () => {
          Arc(
            ArcConfig('arc')
              .width(100)
              .height(100)
              .lineWidth(20)
              .color(0x00ff00)
              .startAngle(start.value)
              .endAngle(start.value + size.value)
          )
        })
        Row(RowConfig('row1.2').fillHeight(0.5).weight(1).background(0xaa2299), () => {})
      })

      const background = size.value > 100 ? 0xffffff : undefined

      Column(
        ColumnConfig('col2')
          .fillWidth(0.75)
          .weight(weight.value)
          .background(0x00ff00)
          .onPointerDown(() => {
            console.log('down')
          })
          .onPointerMove(() => {
            console.log('move')
          })
          .onPointerUp(() => {
            console.log('up')
          })
          .onPointerEnter(() => {
            console.log('enter')
          })
          .onPointerLeave(() => {
            console.log('leave')
          }),
        () => {
          Row(RowConfig('row3').padding(20).background(0x0000ff), () => {
            Column(ColumnConfig('col3').width(size.value).height(size.value).background(0xff00ff), () => {
              Column(ColumnConfig('pad1').padding(10).background(0x9f0000), () => {
                Column(ColumnConfig('pad2').padding(10).background(0x009f00), () => {
                  Text(
                    TextConfig('text').textColor(0xffffff).textSize(20),
                    'a b c d e f g h i j k l m n o p q r s t u v w x y z'
                  )
                })
              })
            })
            // @ts-ignore
            Column(ColumnConfig('margin').padding(size.value, 0, 0, 0).background(background), () => {
              Column(
                ColumnConfig('col4')
                  .width(50)
                  .height(50)
                  .background(0x00ffff)
                  .onPointerDown((e) => {
                    e.capture()
                    start.value = { x: e.x, y: e.y }
                  })
                  .onPointerMove((e) => {
                    position.value = {
                      x: position.value.x + e.x - start.value.x,
                      y: position.value.y + e.y - start.value.y,
                    }

                    start.value = { x: e.x, y: e.y }
                  })
                  .onPointerEnter(() => {
                    console.log('inner enter')
                  })
                  .onPointerLeave(() => {
                    console.log('inner leave')
                  })
                  .offset(position.value.x, position.value.y),
                () => {}
              )
            })
          })
        }
      )
    })
  })
}

HashNavigator.register('dynamicLayout', {
  dynamicLayout: DynamicLayoutExample,
  stack: StackExample,
  column: ColumnExample,
  row: RowExample,
  animation: AnimationExample,
})

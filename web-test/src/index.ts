import { ZappWeb, HashNavigator } from '@zapp/web'
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
} from '@zapp/core'
import { NavBar, RouteInfo } from './NavBar'
import { Page } from './Page'
import { Button } from './Button'

ZappWeb.init()

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

      Stack(StackConfig('stack').alignment(alignment.value).background(0xff0000).width(350).height(350), () => {
        Stack(Config('innerstack.1').width(200).height(200).background(0x00ff00))
        Stack(Config('innerstack.2').width(100).height(100).background(0x0000ff))
      })
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
        Row(Config('align-chooser').padding(0, 0, 0, 25), () => {
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

        Row(Config('arrangement-chooser-two').padding(0, 0, 0, 70), () => {
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
            .weight(1),
          () => {
            Stack(Config('innerstack.1').width(70).height(80).background(0x00ff00))
            Stack(Config('innerstack.2').width(140).height(100).background(0x0000ff))
            Stack(Config('innerstack.3').width(210).height(120).background(0xff00ff))
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
        Row(Config('align-chooser').padding(0, 0, 0, 25), () => {
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

        Row(Config('arrangement-chooser-two').padding(0, 0, 0, 70), () => {
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
            .weight(1),
          () => {
            Stack(Config('innerstack.1').width(80).height(70).background(0x00ff00))
            Stack(Config('innerstack.2').width(100).height(140).background(0x0000ff))
            Stack(Config('innerstack.3').width(120).height(210).background(0xff00ff))
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
        const x = remember(0)

        Stack(Config('stack').width(100).height(100).background(0x00ff00).offset(x.value, 0))
        Stack(Config('spacer').height(100))
        Button(Config('btn-animate'), 'Animate', () => {
          x.value = withTiming((Math.random() - 0.5) * 500, 500)
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
      padding.value = withTiming(100, 2000)
    })

    Column(Config('col').fillSize().padding(padding.value), () => {
      const weight = remember(2)
      const size = remember(50)

      sideEffect(() => {
        weight.value = withTiming(1, 3000)
        size.value = withTiming(200, 3000)
      })

      Row(Config('row1').fillWidth(1).weight(1), () => {
        Row(Config('row1.1').fillHeight(1).weight(1).background(0xff0000), () => {})
        Row(Config('row1.2').fillHeight(0.5).weight(1).background(0xaa2299), () => {})
      })

      const background = size.value > 100 ? 0xffffff : undefined

      Column(
        Config('col2')
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
          Row(Config('row3').padding(20).background(0x0000ff), () => {
            Column(Config('col3').width(size.value).height(size.value).background(0xff00ff), () => {
              Column(Config('pad1').padding(10).background(0x9f0000), () => {
                Column(Config('pad2').padding(10).background(0x009f00), () => {
                  Text(
                    TextConfig('text').textColor(0xffffff).textSize(20),
                    'a b c d e f g h i j k l m n o p q r s t u v w x y z'
                  )
                })
              })
            })
            // @ts-ignore
            Column(Config('margin').padding(size.value, 0, 0, 0).background(background), () => {
              Column(
                Config('col4')
                  .width(50)
                  .height(50)
                  .background(0x00ffff)
                  .onPointerDown((e) => {
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

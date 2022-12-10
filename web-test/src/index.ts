import { registerNavigationRoutes, rememberScrollPosition } from '@zapp-framework/web'
import {
  ActivityIndicator,
  ActivityIndicatorConfig,
  Button,
  ButtonConfig,
  PageIndicator,
  PageIndicatorConfig,
  Text,
  Switch,
  SwitchConfig,
  Divider,
  DividerConfig,
  RadioButton,
  RadioGroup,
  RadioGroupConfig,
  CheckBox,
  CheckBoxConfig,
} from '@zapp-framework/ui'
import {
  Config,
  TextConfig,
  Column,
  Row,
  BareText,
  remember,
  sideEffect,
  withTiming,
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
  rememberLauncherForResult,
  Navigator,
  registerCrownEventHandler,
  registerGestureEventHandler,
  registerHomeButtonEventHandler,
  registerShortcutButtonEventHandler,
  Image,
  ImageConfig,
  GestureType,
} from '@zapp-framework/core'
import { NavBar, RouteInfo } from './NavBar'
import { Page } from './Page'
import { CustomButton } from './CustomButton'

Zapp.startLoop()

const routesInfo: RouteInfo[] = [
  { displayName: 'Dynamic layout example', routeName: 'dynamicLayout' },
  { displayName: 'Stack example', routeName: 'stack' },
  { displayName: 'Column example', routeName: 'column' },
  { displayName: 'Row example', routeName: 'row' },
  { displayName: 'Animation example', routeName: 'animation' },
  { displayName: 'StartForResult example', routeName: 'startForResult' },
  { displayName: 'Crown & Gesture events example', routeName: 'crownGestureEvent' },
  { displayName: 'Button events example', routeName: 'button' },
  { displayName: 'Page indicators', routeName: 'pageIndicators' },
  { displayName: 'Scroll handler', routeName: 'scrollHandler' },
]

function StackExample() {
  Page(routesInfo, () => {
    const alignment = remember(StackAlignment.Center)

    Column(
      ColumnConfig('stack-example')
        .alignment(Alignment.Center)
        .arrangement(Arrangement.Center)
        .fillSize(),
      () => {
        Column(
          ColumnConfig('align-chooser').alignment(Alignment.Center).padding(0, 0, 0, 50),
          () => {
            Row(Config('align-chooser-top'), () => {
              CustomButton(Config('btn-alignment-topstart'), 'TopStart', () => {
                alignment.value = StackAlignment.TopStart
              })
              CustomButton(Config('btn-alignment-topcenter'), 'TopCenter', () => {
                alignment.value = StackAlignment.TopCenter
              })
              CustomButton(Config('btn-alignment-topend'), 'TopEnd', () => {
                alignment.value = StackAlignment.TopEnd
              })
            })

            Row(Config('align-chooser-center'), () => {
              CustomButton(Config('btn-alignment-centerstart'), 'CenterStart', () => {
                alignment.value = StackAlignment.CenterStart
              })
              CustomButton(Config('btn-alignment-center'), 'Center', () => {
                alignment.value = StackAlignment.Center
              })
              CustomButton(Config('btn-alignment-centerend'), 'CenterEnd', () => {
                alignment.value = StackAlignment.CenterEnd
              })
            })

            Row(Config('align-chooser-bottom'), () => {
              CustomButton(Config('btn-alignment-bottomstart'), 'BottomStart', () => {
                alignment.value = StackAlignment.BottomStart
              })
              CustomButton(Config('btn-alignment-bottomcenter'), 'BottomCenter', () => {
                alignment.value = StackAlignment.BottomCenter
              })
              CustomButton(Config('btn-alignment-bottomend'), 'BottomEnd', () => {
                alignment.value = StackAlignment.BottomEnd
              })
            })
          }
        )

        Stack(
          StackConfig('stack')
            .alignment(alignment.value)
            .background(0xff0000)
            .width(350)
            .height(350)
            .padding(10),
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
      }
    )
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
        BareText(TextConfig('align-header').textColor(0xffffff).textSize(24), 'Alignment')
        Row(RowConfig('align-chooser').padding(0, 0, 0, 25), () => {
          CustomButton(Config('btn-alignment-topstart'), 'Start', () => {
            alignment.value = Alignment.Start
          })
          CustomButton(Config('btn-alignment-topcenter'), 'Center', () => {
            alignment.value = Alignment.Center
          })
          CustomButton(Config('btn-alignment-topend'), 'End', () => {
            alignment.value = Alignment.End
          })
        })

        BareText(TextConfig('arrange-header').textColor(0xffffff).textSize(24), 'Arrangement')
        Row(Config('arrangement-chooser-one'), () => {
          CustomButton(Config('btn-arrangement-start'), 'Start', () => {
            arrangement.value = Arrangement.Start
          })
          CustomButton(Config('btn-arrangement-center'), 'Center', () => {
            arrangement.value = Arrangement.Center
          })
          CustomButton(Config('btn-arrangement-end'), 'End', () => {
            arrangement.value = Arrangement.End
          })
        })

        Row(RowConfig('arrangement-chooser-two').padding(0, 0, 0, 70), () => {
          CustomButton(Config('btn-arrangement-between'), 'SpaceBetween', () => {
            arrangement.value = Arrangement.SpaceBetween
          })
          CustomButton(Config('btn-arrangement-around'), 'SpaceAround', () => {
            arrangement.value = Arrangement.SpaceAround
          })
          CustomButton(Config('btn-arrangement-evenly'), 'SpaceEvenly', () => {
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
      ColumnConfig('row-example')
        .alignment(Alignment.Center)
        .arrangement(Arrangement.Center)
        .fillSize()
        .padding(50, 0),
      () => {
        BareText(TextConfig('align-header').textColor(0xffffff).textSize(24), 'Alignment')
        Row(RowConfig('align-chooser').padding(0, 0, 0, 25), () => {
          CustomButton(Config('btn-alignment-topstart'), 'Start', () => {
            alignment.value = Alignment.Start
          })
          CustomButton(Config('btn-alignment-topcenter'), 'Center', () => {
            alignment.value = Alignment.Center
          })
          CustomButton(Config('btn-alignment-topend'), 'End', () => {
            alignment.value = Alignment.End
          })
        })

        BareText(TextConfig('arrange-header').textColor(0xffffff).textSize(24), 'Arrangement')
        Row(Config('arrangement-chooser-one'), () => {
          CustomButton(Config('btn-arrangement-start'), 'Start', () => {
            arrangement.value = Arrangement.Start
          })
          CustomButton(Config('btn-arrangement-center'), 'Center', () => {
            arrangement.value = Arrangement.Center
          })
          CustomButton(Config('btn-arrangement-end'), 'End', () => {
            arrangement.value = Arrangement.End
          })
        })

        Row(RowConfig('arrangement-chooser-two').padding(0, 0, 0, 70), () => {
          CustomButton(Config('btn-arrangement-between'), 'SpaceBetween', () => {
            arrangement.value = Arrangement.SpaceBetween
          })
          CustomButton(Config('btn-arrangement-around'), 'SpaceAround', () => {
            arrangement.value = Arrangement.SpaceAround
          })
          CustomButton(Config('btn-arrangement-evenly'), 'SpaceEvenly', () => {
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
          CustomButton(Config('btn-animation-linear'), 'Linear', () => {
            easing.value = Easing.linear
          })
          CustomButton(Config('btn-animation-ease'), 'Ease', () => {
            easing.value = Easing.ease
          })
        })
        Row(Config('animation-chooser-two'), () => {
          CustomButton(Config('btn-animation-inquad'), 'EaseInQuad', () => {
            easing.value = Easing.easeInQuad
          })
          CustomButton(Config('btn-animation-outquad'), 'EaseOutQuad', () => {
            easing.value = Easing.easeOutQuad
          })
          CustomButton(Config('btn-animation-inoutquad'), 'EaseInOutQuad', () => {
            easing.value = Easing.easeInOutQuad
          })
        })
        Row(RowConfig('animation-chooser-three').padding(0, 0, 0, 70), () => {
          CustomButton(Config('btn-animation-incubic'), 'EaseInCubic', () => {
            easing.value = Easing.easeInCubic
          })
          CustomButton(Config('btn-animation-outcubic'), 'EaseOutCubic', () => {
            easing.value = Easing.easeOutCubic
          })
          CustomButton(Config('btn-animation-inoutcubic'), 'EaseInOutCubic', () => {
            easing.value = Easing.easeInOutCubic
          })
        })
        Stack(RowConfig('stack').width(100).height(100).background(0x00ff00).offset(x.value, 0))
        Stack(Config('spacer').height(50))
        CustomButton(Config('btn-animate'), 'Animate', () => {
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
        Column(ColumnConfig('col1.1').fillHeight(1).weight(1).background(0xff0000), () => {
          const isChecked = remember(true)
          const selected = remember(0)

          Button(ButtonConfig('button'), () => {
            Text(TextConfig('buttontext'), 'Button')
          })
          Divider(DividerConfig('div1').fillWidth())
          Switch(
            SwitchConfig('switch')
              .isChecked(isChecked.value)
              .onChange((v) => {
                isChecked.value = v
              })
          )
          Divider(DividerConfig('div1').fillWidth())
          RadioGroup(
            RadioGroupConfig('radiogroup')
              .selected(selected.value)
              .onChange((s) => {
                selected.value = s
              }),
            () => {
              Column(ColumnConfig('radiocolumn'), () => {
                RadioButton(Config('radio1'), () => {
                  Text(TextConfig('radio1text'), 'Item 1')
                })
                RadioButton(Config('radio2'), () => {
                  Text(TextConfig('radio2text'), 'Item 2')
                })
                RadioButton(Config('radio3'), () => {
                  Text(TextConfig('radio3text'), 'Item 3')
                })
              })
            }
          )
        })
        Row(RowConfig('row1.2').fillHeight(0.75).weight(1).background(0xaa2299), () => {
          const rotation = remember(0)
          sideEffect(() => {
            rotation.value = withTiming(360, { duration: 5000, easing: Easing.easeInOutCubic })
          })
          Image(
            ImageConfig('img')
              .width(130)
              .height(130)
              .innerOffset(15, 15)
              .origin(65, 65)
              .rotation(rotation.value),
            'zapp.png'
          )
          ActivityIndicator(ActivityIndicatorConfig('ac').size(100).lineWidth(10))
        })
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
            Column(
              ColumnConfig('col3').width(size.value).height(size.value).background(0xff00ff),
              () => {
                Column(ColumnConfig('pad1').padding(10).background(0x9f0000), () => {
                  Column(ColumnConfig('pad2').padding(10).background(0x009f00), () => {
                    BareText(
                      TextConfig('BareText').textColor(0xffffff).textSize(20),
                      'a b c d e f g h i j k l m n o p q r s t u v w x y z'
                    )
                  })
                })
              }
            )
            Column(
              // @ts-ignore
              ColumnConfig('margin').padding(size.value, 0, 0, 0).background(background),
              () => {
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
              }
            )
          })

          const checked = remember(false)
          CheckBox(
            CheckBoxConfig('checkbox')
              .checked(checked.value)
              .onChange((c) => {
                checked.value = c
              }),
            () => {
              Text(TextConfig('checkboxtext'), 'CheckBox')
            }
          )
        }
      )
    })
  })
}

function StartForResultExample() {
  Page(routesInfo, () => {
    Column(
      ColumnConfig('column').alignment(Alignment.Center).arrangement(Arrangement.Center),
      () => {
        const value = remember('nothing')
        const anim = remember(0)
        const launcher = rememberLauncherForResult('picker', (result) => {
          value.value = result!.res as string
        })

        sideEffect(() => {
          anim.value = withTiming(400, { duration: 1000 })
        })

        Stack(StackConfig('box').width(100).height(100).background(0xff0000).offset(0, anim.value))

        BareText(TextConfig('value-BareText').textColor(0xffffff).textSize(40), value.value)

        CustomButton(Config('btn'), 'Open', () => {
          launcher.launch()
        })

        CustomButton(Config('clear'), 'Clear', () => {
          value.value = 'nothing'
        })
      }
    )
  })
}

function NumberPickerExample() {
  Page(routesInfo, () => {
    Column(
      ColumnConfig('column').alignment(Alignment.Center).arrangement(Arrangement.Center),
      () => {
        CustomButton(Config('btn1'), 'Send 1', () => {
          Navigator.finishWithResult({ res: '1' })
        })

        CustomButton(Config('btn2'), 'Send 2', () => {
          Navigator.finishWithResult({ res: '2' })
        })

        CustomButton(Config('btn3'), 'Send 3', () => {
          Navigator.finishWithResult({ res: '3' })
        })
      }
    )
  })
}

function CrownGestureEventExample() {
  Page(routesInfo, () => {
    const height = remember(10)
    const targetHeight = remember(10)
    const lastGesture = remember('')

    registerCrownEventHandler((delta: number) => {
      targetHeight.value = Math.max(10, targetHeight.value + delta * -1)
      height.value = withTiming(targetHeight.value, { easing: Easing.easeOutCubic })
      return true
    })

    registerGestureEventHandler((gesture) => {
      lastGesture.value = gesture
      return true
    })

    Column(
      ColumnConfig('column').alignment(Alignment.Center).arrangement(Arrangement.Center),
      () => {
        Stack(StackConfig('bar').width(50).height(height.value).background(0xff0000))
      }
    )

    BareText(TextConfig('BareText').textColor(0xffffff).textSize(30), lastGesture.value)
  })
}

function ButtonEventExample() {
  Page(routesInfo, () => {
    const lastAction = remember('')

    registerHomeButtonEventHandler({
      onPress: () => {
        lastAction.value = 'home press'
        console.log('press')
        return true
      },
      onClick: () => {
        lastAction.value = 'home click'
        console.log('click')
        return true
      },
      onLongPress: () => {
        lastAction.value = 'home longpress'
        console.log('lp')
        return true
      },
      onRelease: () => {
        lastAction.value = 'home release'
        console.log('release')
        return true
      },
    })

    registerShortcutButtonEventHandler({
      onPress: () => {
        lastAction.value = 'shortcut press'
        return true
      },
      onClick: () => {
        lastAction.value = 'shortcut click'
        return true
      },
      onLongPress: () => {
        lastAction.value = 'shortcut longpress'
        return true
      },
      onRelease: () => {
        lastAction.value = 'shortcut release'
        return true
      },
    })

    BareText(TextConfig('BareText').textColor(0xffffff).textSize(30), lastAction.value)
  })
}

function PageIndicators() {
  const renderIndicator = (
    id: string,
    horizontal: boolean,
    radius: number,
    curved: boolean,
    currentPage: number,
    numberOfPages: number
  ) => {
    PageIndicator(
      PageIndicatorConfig(id)
        .horizontal(horizontal)
        .curveRadius(radius)
        .curved(curved)
        .numberOfPages(numberOfPages)
        .currentPage(currentPage)
    )
  }

  Page(routesInfo, () => {
    Column(ColumnConfig('column').fillSize().background(0x333333), () => {
      const numberOfPages = 11
      const currentPage = remember(0)

      registerGestureEventHandler((type) => {
        let next = currentPage.value
        if (type === GestureType.Up) {
          next--
        } else if (type === GestureType.Down) {
          next++
        }
        next = Math.max(0, Math.min(next, numberOfPages - 1))

        currentPage.value = next
        return true
      })

      Row(RowConfig('horizontal').fillWidth().weight(1), () => {
        Row(
          RowConfig('horizontalSquareWrapper')
            .fillHeight(1)
            .weight(1)
            .alignment(Alignment.Center)
            .arrangement(Arrangement.Center),
          () => {
            Stack(
              StackConfig('horizontalSquare').width(300).height(300).background(0x000000),
              () => {
                renderIndicator('indicatorHS', true, 150, false, currentPage.value, numberOfPages)
              }
            )
          }
        )

        Row(
          RowConfig('horizontalRoundWrapper')
            .fillHeight(1)
            .weight(1)
            .alignment(Alignment.Center)
            .arrangement(Arrangement.Center),
          () => {
            Stack(
              StackConfig('horizontalRound')
                .width(400)
                .height(400)
                .cornerRadius(200)
                .background(0x000000),
              () => {
                renderIndicator('indicatorHR', true, 200, true, currentPage.value, numberOfPages)
              }
            )
          }
        )
      })

      Row(RowConfig('vertical').fillWidth().weight(1), () => {
        Row(
          RowConfig('verticalSquareWrapper')
            .fillHeight(1)
            .weight(1)
            .alignment(Alignment.Center)
            .arrangement(Arrangement.Center),
          () => {
            Stack(StackConfig('verticalSquare').width(300).height(300).background(0x000000), () => {
              renderIndicator('indicatorVS', false, 150, false, currentPage.value, numberOfPages)
            })
          }
        )

        Row(
          RowConfig('verticalRoundWrapper')
            .fillHeight(1)
            .weight(1)
            .alignment(Alignment.Center)
            .arrangement(Arrangement.Center),
          () => {
            Stack(
              StackConfig('verticalRound')
                .width(300)
                .height(300)
                .cornerRadius(150)
                .background(0x000000),
              () => {
                renderIndicator('indicatorVR', false, 150, true, currentPage.value, numberOfPages)
              }
            )
          }
        )
      })
    })
  })
}

function ScrollHandler() {
  Page(
    routesInfo,
    () => {
      Column(ColumnConfig('column').fillWidth().height(1500).background(0x333333), () => {
        const scroll = rememberScrollPosition()

        Stack(
          StackConfig('stack').width(200).height(200).background(0xff0000).offset(0, scroll.value)
        )
      })
    },
    StackAlignment.TopStart
  )
}

registerNavigationRoutes('dynamicLayout', {
  dynamicLayout: DynamicLayoutExample,
  stack: StackExample,
  column: ColumnExample,
  row: RowExample,
  animation: AnimationExample,
  startForResult: StartForResultExample,
  picker: NumberPickerExample,
  crownGestureEvent: CrownGestureEventExample,
  button: ButtonEventExample,
  pageIndicators: PageIndicators,
  scrollHandler: ScrollHandler,
})

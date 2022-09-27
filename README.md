<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/21055725/188731082-9af12e72-df42-477c-bf54-e6451ffec819.png">
    <img alt="Zapp logo" src="https://user-images.githubusercontent.com/21055725/188731155-0e2f3474-f11e-4511-8dca-649848dacaac.png">
  </picture>
</p>

Declarative framework for making ZeppOS apps with syntax inspired by Jetpack Compose and some React Native sprinkled in. I made this because I wanted an app that would show me real-time time table for exacly three bus stops and I didn't want to bother with the ZeppOS API 🙂. It came out great btw., here's how it looks:

<p align="center">
<img src="https://github.com/j-piasecki/zapp-framework/blob/main/assets/screenshot1.png?raw=true" width="300">
<img src="https://github.com/j-piasecki/zapp-framework/blob/main/assets/screenshot2.png?raw=true" width="300">
</p>

## What's inside?

Zapp is divided into four packages:

- `core` - As the name suggests, it contains the core functionality of the framework: managing state, layout calculation, updating UI, handling events and animations. It also provides core components for building more complex UIs.
- `ui` - Not suprisingly, it provides basic UI components and cohesive theming system.
- `watch` - Injects ZeppOS bindings into the `core` package and provides watch-specific functionality, like key-value storage and different screen types.
- `web` - Injects web bindings into the `core` package and provides web-specific functionality (mainly with regards to navigation).

## Ok, but how does it work?

The general idea is that executing a function related to the view or effect creates a node in the tree representing the current state of the app. This function, in turn, executes its body in the context of the newly created node, thus maintaining parent-child relation. That tree is then transformed to a new tree containing only the view nodes and layout is calculated using the new tree. Next, the new tree is compared to the old one and the differences between them are resolved - if a node is no longer presend, the corresponding native view is dropped, if a new node appears, the new native view is created, and if the node stays, the existing native view gets updated.

## This sounds like a lot, doesn't it impact performance?

Yes, it does. The heavier the tree (the more nodes it has), the more time those operations take and, since the ZeppOS watches are not really powerful devices, the time required to perform update quickly rises. It's not making apps unusable but it certainly gets noticable. There is a lot of room to improvement so things may get better in the future, but many of the shortcomings may be solved by some original ideas. For example, in the bus stop app the first render took a bit more time than I liked, causing a very noticable lag when hiding activity indicator, so I made only four first departures visible during the first render. The rest gets rendered after that - the lag is still there, but it's divided into two parts, and the second, longer, one happens when the screen is populated so it's almost unnoticable.

## So why should I use it despite the performance hit?

Well, it provides a lot of things that are missing in the native ZeppOS:

- preservation of z-index when creating nodes (displaying them conditionally)
- layout calculation, so you don't have to position evertyhing absolutely
- more advanced navigation - preserving the state of screens when navigating, and mechanism for passing data backwards (similar to `rememberLauncherForActivityResult()` from Compose)
- everything from the `core` and `ui` packages also works on web so you can make use of the development tools when developing the ui
- a very simple API for persistent storage, almost indentical to state
- updating the UI automatically on state change
- animation API (not very useful at the moment due to performance)
- nice-ish, declarative API

Besides, it abstracts away some quirks that affects ZeppOS at the moment, like the need to update all props of a rectangle to move it or change its size, or the fact that touch event are a pain to work with.

## Hmm, yeah it sounds nice. So how does it look?

Before an example, I just wanted to explain all those configs you're going to see - besides customizing a view they are also the way Zapp is able to keep track of views between updates, as every config requires an id as an argument. That's the best I could figure out and you get kind of used to them. So with that out of the way, here's an example:

```js
SimpleScreen(Config('screen'), (params) => {
  Column(
    ColumnConfig('wrapper')
      .fillSize()
      .arrangement(Arrangement.Center)
      .alignment(Alignment.Center),
    () => {
      const selected = rememberSaveable('number', 1)

      RadioGroup(
        RadioGroupConfig('radio')
          .selected(selected.value - 1)
          .onChange((v) => {
            selected.value = v + 1
          }),
        () => {
          Column(ColumnConfig('radiowrapper').padding(0, 0, 0, 24), () => {
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

      Button(
        ButtonConfig('button').onPress(() => {
          Navigator.goBack()
        }),
        () => {
          Text(TextConfig('buttontext'), 'Ok')
        }
      )
    }
  )
}
```

And here's the result:

<p align="center">
<img src="https://github.com/j-piasecki/zapp-framework/blob/main/assets/example.png?raw=true" width="360">
</p>

Also, remember when I said that persistent storage is simple? Look at `rememberSaveable('number', 1)` - this is everything you need to do to save a value. In this case `number` is the key under which the value will be saved and `1` is the default value to use when no value was hitherto saved. In case you were wondering what will happen when you call `rememberSaveable` in a few places with the same key and assign value to one of them, then the answer is all of them will get updated.
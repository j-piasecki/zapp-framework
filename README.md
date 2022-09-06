<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/21055725/188731082-9af12e72-df42-477c-bf54-e6451ffec819.png">
    <img alt="Zapp logo" src="https://user-images.githubusercontent.com/21055725/188731155-0e2f3474-f11e-4511-8dca-649848dacaac.png">
  </picture>
</p>

Framework for making ZeppOS apps. I made this because I wanted an app that would show me real-time time table for exacly three bus stops and I didn't like the API 🙂.

Stuff that works:

- Works both on ZeppOS and on web (with small exception for navigation, which works but uses different API)
- Layout (Row, Column and Stack)
- State management and UI updates
- Preserving z-index
- Animations (usually look pretty bad on watch, but may be usefull for small components - `ActivityIndicator` works suprisingly well)
- Simple navigation
- Touch events
- Text
- Arc
- Border

TODO:

- [ ] Fully fledged navigation:
  - store navigation stack
  - save & restore state on navigation
  - possibly enable passing data backwards (like startActivityForResult)
- [ ] Method to dump current state nodes of the working tree (for navigation)
- [ ] Method to restore state in the tree from the created dump (for navigation)
- [ ] Images
- [ ] Swipe gestures
- [ ] Crown events
- [ ] Scroll support (paginated and not)
- [ ] Button support
  - possibly intercept home and change it to back
  - possibly intercept shortuct and change it to select
- [ ] Ui components with material-like theming
- [ ] Docs
import {
  PointerEventManager,
  Renderer,
  WorkingTree,
  ZappInterface,
  Platform,
  Animation,
  GlobalEventManager,
  GestureType,
  EventType,
  ButtonAction,
  ScreenShape,
} from '@zapp-framework/core'

export class ZappWeb extends ZappInterface {
  private running = false
  private crownDelta = 0
  private previousCrownDelta = 0
  private crownResetTimeout = -1
  private savedData: Record<string, unknown> = {}

  public startLoop() {
    this.running = true
    WorkingTree.requestUpdate()
    requestAnimationFrame(this.update)

    window.addEventListener('wheel', (e) => {
      this.crownDelta += e.deltaY / 10

      clearTimeout(this.crownResetTimeout)
      setTimeout(() => {
        this.crownDelta = 0
      }, 100)
    })

    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Home':
          GlobalEventManager.dispatchButtonEvent(EventType.HomeButton, ButtonAction.Press)
          break
        case 'End':
          GlobalEventManager.dispatchButtonEvent(EventType.ShortcutButton, ButtonAction.Press)
          break
      }
    })

    window.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          GlobalEventManager.dispatchGestureEvent(GestureType.Up)
          break
        case 'ArrowDown':
          GlobalEventManager.dispatchGestureEvent(GestureType.Down)
          break
        case 'ArrowLeft':
          GlobalEventManager.dispatchGestureEvent(GestureType.Left)
          break
        case 'ArrowRight':
          GlobalEventManager.dispatchGestureEvent(GestureType.Right)
          break
        case 'Home':
          GlobalEventManager.dispatchButtonEvent(EventType.HomeButton, ButtonAction.Release)
          break
        case 'End':
          GlobalEventManager.dispatchButtonEvent(EventType.ShortcutButton, ButtonAction.Release)
          break
      }
    })
  }

  setValue(key: string, value: unknown): void {
    this.savedData[key] = value
  }

  getValue(key: string): unknown {
    return this.savedData[key]
  }

  stopLoop(): void {
    this.running = false
  }

  get platform(): Platform {
    return Platform.Web
  }

  get screenShape() {
    return ScreenShape.Square
  }

  private update = () => {
    if (this.crownDelta !== this.previousCrownDelta) {
      this.previousCrownDelta = this.crownDelta
      GlobalEventManager.dispatchCrownEvent(this.crownDelta)
    }

    PointerEventManager.processEvents()
    GlobalEventManager.tick()
    Animation.nextFrame(Date.now())

    if (WorkingTree.hasUpdates()) {
      WorkingTree.performUpdate()
      Renderer.commit(WorkingTree.root)
      Renderer.render()
    }

    if (this.running) {
      requestAnimationFrame(this.update)
    }
  }
}

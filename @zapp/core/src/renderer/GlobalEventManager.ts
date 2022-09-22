import { Navigator } from '../Navigator.js'
import { GestureType } from '../working_tree/effects/registerGestureEventHandler.js'
import { ButtonAction, EventType } from '../working_tree/EventNode.js'
import { PointerEventType } from '../working_tree/props/types.js'
import { PointerEventManager } from './PointerEventManager.js'
import { RenderedTree } from './RenderedTree.js'
import { ViewManager } from './ViewManager.js'

export interface EventHandler {
  type: EventType
  buttonAction?: ButtonAction
  handler: (...args: any[]) => boolean
}

class ButtonEventManager {
  private isPressed = false
  private type: EventType
  private pressTimestamp: number
  private longPressFired: boolean

  constructor(type: EventType) {
    this.type = type
  }

  public tick() {
    if (this.isPressed && !this.longPressFired && Date.now() - this.pressTimestamp > 500) {
      this.longPressFired = this.triggerEvent(ButtonAction.LongPress)
    }
  }

  public dispatchEvent(action: ButtonAction): boolean {
    if (action === ButtonAction.Press) {
      if (!this.isPressed) {
        this.pressTimestamp = Date.now()
        this.isPressed = true
        this.longPressFired = false

        return this.triggerEvent(action)
      }
    } else if (action === ButtonAction.Release) {
      this.isPressed = false
      let result = false

      if (Date.now() - this.pressTimestamp <= 500) {
        result = this.triggerEvent(ButtonAction.Click) || result
      } else if (!this.longPressFired) {
        result = this.triggerEvent(ButtonAction.LongPress) || result
      }

      return this.triggerEvent(action) || result
    }

    return false
  }

  private triggerEvent(action: ButtonAction): boolean {
    // iterate upwards so the deeper nodes receive the event earlier
    for (let i = GlobalEventManager.handlers.length - 1; i >= 0; i--) {
      const handler = GlobalEventManager.handlers[i]
      if (handler.type === this.type && handler.buttonAction === action && handler.handler()) {
        return true
      }
    }

    if (this.type === EventType.HomeButton) {
      if (action === ButtonAction.Click) {
        Navigator.goBack()
      } else if (action === ButtonAction.LongPress) {
        Navigator.goHome()
      }
    } else if (this.type === EventType.ShortcutButton && action === ButtonAction.Click) {
      const x = ViewManager.screenWidth / 2
      const y = ViewManager.screenHeight / 2
      const target = RenderedTree.hitTest(x, y)

      if (target !== null) {
        PointerEventManager.queueEvent({
          target: target.id,
          x: x,
          y: y,
          id: Number.MAX_SAFE_INTEGER,
          type: PointerEventType.DOWN,
          timestamp: Date.now(),
          capture: () => {},
        })

        PointerEventManager.queueEvent({
          target: target.id,
          x: x,
          y: y,
          id: Number.MAX_SAFE_INTEGER,
          type: PointerEventType.UP,
          timestamp: Date.now(),
          capture: () => {},
        })
      }
    }

    return false
  }
}

export abstract class GlobalEventManager {
  /** @internal */
  static handlers: EventHandler[] = []

  private static homeButtonManager = new ButtonEventManager(EventType.HomeButton)
  private static shortcutButtonManager = new ButtonEventManager(EventType.ShortcutButton)

  public static clearHandlers() {
    GlobalEventManager.handlers = []
  }

  public static registerHandler(handler: EventHandler) {
    GlobalEventManager.handlers.push(handler)
  }

  public static dispatchCrownEvent(delta: number): boolean {
    // iterate upwards so the deeper nodes receive the event earlier
    for (let i = GlobalEventManager.handlers.length - 1; i >= 0; i--) {
      const handler = GlobalEventManager.handlers[i]
      if (handler.type === EventType.Crown && handler.handler(delta)) {
        return true
      }
    }

    return false
  }

  public static dispatchGestureEvent(gesture: GestureType): boolean {
    // iterate upwards so the deeper nodes receive the event earlier
    for (let i = GlobalEventManager.handlers.length - 1; i >= 0; i--) {
      const handler = GlobalEventManager.handlers[i]
      if (handler.type === EventType.Gesture && handler.handler(gesture)) {
        return true
      }
    }

    return false
  }

  public static dispatchButtonEvent(type: EventType, action: ButtonAction): boolean {
    switch (type) {
      case EventType.HomeButton:
        return GlobalEventManager.homeButtonManager.dispatchEvent(action)
      case EventType.ShortcutButton:
        return GlobalEventManager.shortcutButtonManager.dispatchEvent(action)
    }

    return false
  }

  public static tick() {
    this.homeButtonManager.tick()
    this.shortcutButtonManager.tick()
  }
}

import { EventType } from '../working_tree/EventNode.js'

export interface EventHandler {
  type: EventType
  handler: (...args: any[]) => boolean
}

export abstract class GlobalEventManager {
  private static handlers: EventHandler[] = []

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
}

import { PointerData, PointerEventType } from '../working_tree/props/Config.js'
import { RenderNode } from './Renderer.js'

export abstract class EventManager {
  private static eventQueue: PointerData[] = []
  private static eventTargets: Map<string, RenderNode> = new Map()

  public static queueEvent(event: PointerData) {
    const indexToCoalesce = this.eventQueue.findIndex(
      (e) => e.id === event.id && e.type === event.type && e.target === event.target
    )
    if (indexToCoalesce === -1) {
      EventManager.eventQueue.push(event)
    } else {
      EventManager.eventQueue[indexToCoalesce] = event
    }
  }

  public static addEventTarget(node: RenderNode) {
    EventManager.eventTargets.set(node.id, node)
  }

  public static dropEventTarget(node: RenderNode) {
    EventManager.eventTargets.delete(node.id)
  }

  public static processEvents() {
    // TODO: consider sending move event only to the view that receiver down event
    // TODO: handle leave and enter between parent and child correctly
    EventManager.eventQueue.forEach((event) => {
      const target = EventManager.eventTargets.get(event.target)

      if (target !== undefined) {
        switch (event.type) {
          case PointerEventType.DOWN:
            target.config.onPointerDown?.(event)
            break
          case PointerEventType.MOVE:
            target.config.onPointerMove?.(event)
            break
          case PointerEventType.UP:
            target.config.onPointerUp?.(event)
            break
          case PointerEventType.ENTER:
            target.config.onPointerEnter?.(event)
            break
          case PointerEventType.LEAVE:
            target.config.onPointerLeave?.(event)
            break
        }
      }
    })

    EventManager.eventQueue = []
  }
}

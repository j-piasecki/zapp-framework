import { PointerData, PointerEventType } from '../working_tree/props/types.js'
import { RenderNode } from './Renderer.js'

export abstract class EventManager {
  private static eventQueue: PointerData[] = []
  private static eventTargets: Map<string, RenderNode> = new Map()

  private static shouldFillLeaveEnterEvents = false
  private static lastMoveEvent?: PointerData

  public static fillLeaveEnterEvents() {
    EventManager.shouldFillLeaveEnterEvents = true
  }

  public static queueEvent(event: PointerData) {
    if (EventManager.shouldFillLeaveEnterEvents && event.type === PointerEventType.MOVE) {
      if (EventManager.lastMoveEvent !== undefined && EventManager.lastMoveEvent.target !== event.target) {
        EventManager.queueEvent({ ...EventManager.lastMoveEvent, type: PointerEventType.LEAVE })
        EventManager.queueEvent({ ...event, type: PointerEventType.ENTER })

        EventManager.lastMoveEvent = event
        return
      } else {
        EventManager.lastMoveEvent = event
      }
    } else {
      EventManager.lastMoveEvent = undefined
    }

    // handle not sending enter and leave events when moving between parent and child with inherited handlers
    if (event.type === PointerEventType.ENTER) {
      const enterTarget = EventManager.eventTargets.get(event.target)

      if (enterTarget !== undefined) {
        // iterate backwards, as we expect leave event to be sent just before enter event
        for (let i = EventManager.eventQueue.length - 1; i >= 0; i--) {
          const leaveEvent = EventManager.eventQueue[i]
          const leaveTarget = EventManager.eventTargets.get(leaveEvent.target)

          if (leaveEvent.type === PointerEventType.LEAVE && leaveTarget !== undefined) {
            let parentCandidate = null
            let childCandidate = null

            // parent will always have lower z-index than child, because of this we know which one may be the parent
            if (leaveTarget.zIndex > enterTarget.zIndex) {
              parentCandidate = enterTarget
              childCandidate = leaveTarget
            } else {
              parentCandidate = leaveTarget
              childCandidate = enterTarget
            }

            // check whether there is a parent-child relation and events are inherited
            if (
              EventManager.isParent(parentCandidate, childCandidate) &&
              parentCandidate.config.onPointerEnter === childCandidate.config.onPointerEnter &&
              parentCandidate.config.onPointerLeave === childCandidate.config.onPointerLeave
            ) {
              // if so, remove leave event from queue and don't queue enter event
              EventManager.eventQueue.splice(i, 1)
              return
            }
          }
        }
      }
    }

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
    // TODO: consider sending move event only to the view that received down event
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

  private static isParent(parent: RenderNode, childCandidate: RenderNode): boolean {
    if (parent.id === childCandidate.id) {
      return true
    }

    for (const child of parent.children) {
      if (EventManager.isParent(child, childCandidate)) {
        return true
      }
    }

    return false
  }
}

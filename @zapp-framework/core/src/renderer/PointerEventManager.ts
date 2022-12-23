import { PointerData, PointerEventType } from '../working_tree/props/types.js'
import { RenderedTree, RenderNode } from './RenderedTree.js'

export abstract class PointerEventManager {
  private static eventQueue: PointerData[] = []
  private static eventTargets: Map<string, RenderNode> = new Map()

  private static shouldFillLeaveEnterEvents = false
  private static lastMoveEvent?: PointerData

  private static capturedPointers: Map<number, string> = new Map()
  private static lastReceivedEvent: PointerData[] = []

  public static fillLeaveEnterEvents() {
    PointerEventManager.shouldFillLeaveEnterEvents = true
  }

  public static queueEvent(event: PointerData) {
    const capturedBy = this.capturedPointers.get(event.id)

    if (capturedBy !== undefined) {
      event.target = capturedBy

      // in case Enter or Leave pointer is sent we need to remap it to Move
      if (event.type === PointerEventType.ENTER || event.type === PointerEventType.LEAVE) {
        event.type = PointerEventType.MOVE
      }
    } else {
      if (PointerEventManager.shouldFillLeaveEnterEvents && event.type === PointerEventType.MOVE) {
        if (
          PointerEventManager.lastMoveEvent !== undefined &&
          PointerEventManager.lastMoveEvent.target !== event.target
        ) {
          PointerEventManager.queueEvent({
            ...PointerEventManager.lastMoveEvent,
            type: PointerEventType.LEAVE,
          })
          PointerEventManager.queueEvent({ ...event, type: PointerEventType.ENTER })

          PointerEventManager.lastMoveEvent = event
          return
        } else {
          PointerEventManager.lastMoveEvent = event
        }
      } else {
        PointerEventManager.lastMoveEvent = undefined
      }

      // handle not sending enter and leave events when moving between parent and child with inherited handlers
      if (event.type === PointerEventType.ENTER) {
        const enterTarget = PointerEventManager.eventTargets.get(event.target)

        if (enterTarget !== undefined) {
          // iterate backwards, as we expect leave event to be sent just before enter event
          for (let i = PointerEventManager.eventQueue.length - 1; i >= 0; i--) {
            const leaveEvent = PointerEventManager.eventQueue[i]
            const leaveTarget = PointerEventManager.eventTargets.get(leaveEvent.target)

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
                PointerEventManager.isParent(parentCandidate, childCandidate) &&
                parentCandidate.config.onPointerEnter === childCandidate.config.onPointerEnter &&
                parentCandidate.config.onPointerLeave === childCandidate.config.onPointerLeave
              ) {
                // if so, remove leave event from queue and don't queue enter event
                PointerEventManager.eventQueue.splice(i, 1)
                return
              }
            }
          }
        }
      }
    }

    const indexToCoalesce = this.eventQueue.findIndex(
      (e) => e.id === event.id && e.type === event.type && e.target === event.target
    )
    if (indexToCoalesce === -1) {
      PointerEventManager.eventQueue.push(event)
    } else {
      PointerEventManager.eventQueue[indexToCoalesce] = event
    }

    PointerEventManager.lastReceivedEvent[event.id] = event
  }

  public static addEventTarget(node: RenderNode) {
    PointerEventManager.eventTargets.set(node.id, node)
  }

  public static dropEventTarget(node: RenderNode) {
    // only drop event targets when the view doesn't change, which may happen when
    // the view gets recreated but the new view is created before dropping the old one
    //
    // in that situation the new view registers the target under the same id, and when
    // the old one is dropped it would drop the new target
    if (PointerEventManager.eventTargets.get(node.id)?.view === node.view) {
      PointerEventManager.eventTargets.delete(node.id)
    }
  }

  public static processEvents() {
    // TODO: consider sending move event only to the view that received down event
    PointerEventManager.eventQueue.forEach((event) => {
      const target = PointerEventManager.eventTargets.get(event.target) ?? null

      if (target !== null) {
        switch (event.type) {
          case PointerEventType.DOWN:
            target.config.onPointerDown?.(event)
            break
          case PointerEventType.MOVE:
            target.config.onPointerMove?.(event)
            break
          case PointerEventType.UP:
            target.config.onPointerUp?.(event)

            // free the pointer capture when it goes up
            PointerEventManager.capturedPointers.delete(event.id)
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

    PointerEventManager.eventQueue = []
  }

  public static capturePointer(id: number, target: string) {
    PointerEventManager.capturedPointers.set(id, target)
  }

  public static hasCapturedPointers() {
    return PointerEventManager.capturedPointers.size !== 0
  }

  public static cancelPointers() {
    for (const data of PointerEventManager.lastReceivedEvent) {
      if (data !== undefined && data.type !== PointerEventType.UP) {
        PointerEventManager.queueEvent({
          ...data,
          // TODO: make a CANCEL event?
          type: PointerEventType.LEAVE,
        })
      }
    }
  }

  private static isParent(parent: RenderNode, childCandidate: RenderNode): boolean {
    if (parent.id === childCandidate.id) {
      return true
    }

    for (const child of parent.children) {
      if (PointerEventManager.isParent(child, childCandidate)) {
        return true
      }
    }

    return false
  }
}

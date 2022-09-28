import { EventType } from '../EventNode.js'
import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'

export enum GestureType {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export function registerGestureEventHandler(handler: (gesture: GestureType) => boolean) {
  const current = WorkingTree.current as ViewNode
  const context = WorkingTree.event(current)

  context.handler = handler
  context.eventType = EventType.Gesture

  current.children.push(context)
}

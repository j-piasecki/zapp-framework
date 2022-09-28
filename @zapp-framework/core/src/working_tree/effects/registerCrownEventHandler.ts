import { EventType } from '../EventNode.js'
import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'

export function registerCrownEventHandler(handler: (delta: number) => boolean) {
  const current = WorkingTree.current as ViewNode
  const context = WorkingTree.event(current)

  context.handler = handler
  context.eventType = EventType.Crown

  current.children.push(context)
}

import { EventType } from '../EventNode.js'
import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { ButtonActions, getAction } from './ButtonActions.js'

export function registerShortcutButtonEventHandler(actions: ButtonActions) {
  const current = WorkingTree.current as ViewNode

  for (const handlerName in actions) {
    const handler = actions[handlerName]

    if (handler !== undefined) {
      const context = WorkingTree.event(current)

      context.handler = handler
      context.eventType = EventType.ShortcutButton
      context.buttonAction = getAction(handlerName)

      current.children.push(context)
    }
  }
}

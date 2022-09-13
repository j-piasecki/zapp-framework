import { ButtonAction } from '../EventNode.js'

export interface ButtonActions extends Record<string, (() => boolean) | undefined> {
  onPress?: () => boolean
  onRelease?: () => boolean
  onClick?: () => boolean
  onLongPress?: () => boolean
}

export function getAction(handlerName: keyof ButtonActions): ButtonAction {
  switch (handlerName) {
    case 'onPress':
      return ButtonAction.Press
    case 'onRelease':
      return ButtonAction.Release
    case 'onClick':
      return ButtonAction.Click
    default:
      return ButtonAction.LongPress
  }
}

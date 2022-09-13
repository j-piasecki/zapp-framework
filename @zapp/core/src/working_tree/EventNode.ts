import { WorkingNode } from './WorkingNode.js'

export enum EventType {
  HomeButton,
  ShortcutButton,
  Crown,
  Gesture,
}

export enum ButtonAction {
  Press,
  Release,
  Click,
  LongPress,
}

export class EventNode extends WorkingNode {
  public handler: (...args: any[]) => boolean
  public eventType: EventType
  public buttonAction?: ButtonAction
}

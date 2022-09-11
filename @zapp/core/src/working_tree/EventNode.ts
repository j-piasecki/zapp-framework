import { WorkingNode } from './WorkingNode.js'

export enum EventType {
  Button,
  Crown,
  Gesture,
}

export class EventNode extends WorkingNode {
  public handler: (...args: any[]) => boolean
  public eventType: EventType
}

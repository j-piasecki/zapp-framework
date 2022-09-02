export interface Padding {
  top: number
  bottom: number
  start: number
  end: number
}

export enum PointerEventType {
  DOWN,
  UP,
  MOVE,
  ENTER,
  LEAVE,
}

export interface PointerData {
  target: string
  id: number
  x: number
  y: number
  timestamp: number
  type: PointerEventType
}

export interface ConfigType {
  id: string

  fillSize?: boolean

  weight?: number
  background?: number
  cornerRadius?: number

  width?: number
  fillWidth?: number

  height?: number
  fillHeight?: number

  padding?: Padding
  offsetX?: number
  offsetY?: number

  text?: string
  textSize?: number
  textColor?: number

  arrangement?: Arrangement
  alignment?: Alignment
  stackAlignment?: StackAlignment

  onPointerDown?: (event: PointerData) => void
  onPointerMove?: (event: PointerData) => void
  onPointerUp?: (event: PointerData) => void
  onPointerEnter?: (event: PointerData) => void
  onPointerLeave?: (event: PointerData) => void
}

/**
 * Positioning along the main axis
 */
export enum Arrangement {
  SpaceBetween,
  SpaceAround,
  SpaceEvenly,
  Start,
  Center,
  End,
}

/**
 * Positioning along the secondary axis
 */
export enum Alignment {
  Start,
  Center,
  End,
}

export enum StackAlignment {
  CenterStart,
  Center,
  CenterEnd,
  TopStart,
  TopCenter,
  TopEnd,
  BottomStart,
  BottomCenter,
  BottomEnd,
}
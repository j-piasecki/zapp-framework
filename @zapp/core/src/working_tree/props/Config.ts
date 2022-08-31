export function Config(id: string) {
  return new ConfigBuilder(id)
}

export interface Padding {
  top: number
  bottom: number
  start: number
  end: number
}

export interface PointerData {
  id: number
  x: number
  y: number
  timestamp: number
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

  onPointerDown?: (event: PointerData) => void
  onPointerMove?: (event: PointerData) => void
  onPointerUp?: (event: PointerData) => void
}

export class ConfigBuilder {
  protected config: ConfigType

  constructor(id: string) {
    this.config = {
      id: id,
    }
  }

  public build() {
    return this.config
  }

  public merge(other: ConfigBuilder) {
    Object.assign(this.config, other.config)
    return this
  }

  public fillSize(): Omit<this, 'width' | 'fillWidth' | 'height' | 'fillHeight' | 'fillSize'> {
    this.config.fillSize = true
    return this
  }

  public fillWidth(portion: number): Omit<this, 'width' | 'fillWidth' | 'fillSize'> {
    this.config.fillWidth = portion
    return this
  }

  public fillHeight(portion: number): Omit<this, 'height' | 'fillHeight' | 'fillSize'> {
    this.config.fillHeight = portion
    return this
  }

  public width(width: number): Omit<this, 'width' | 'fillWidth' | 'fillSize'> {
    this.config.width = width
    return this
  }

  public height(height: number): Omit<this, 'height' | 'fillHeight' | 'fillSize'> {
    this.config.height = height
    return this
  }

  public weight(weight: number): Omit<this, 'weight'> {
    this.config.weight = weight
    return this
  }

  public padding(padding: number): Omit<this, 'padding'>
  public padding(vertical: number, horizontal: number): Omit<this, 'padding'>
  public padding(start: number, top: number, end: number, bottom: number): Omit<this, 'padding'>
  public padding(start: number, top?: number, end?: number, bottom?: number): Omit<this, 'padding'> {
    if (top !== undefined && end !== undefined && bottom !== undefined) {
      this.config.padding = {
        start: start,
        top: top,
        end: end,
        bottom: bottom,
      }
    } else if (top !== undefined) {
      this.config.padding = {
        start: top,
        top: start,
        end: top,
        bottom: start,
      }
    } else {
      this.config.padding = {
        start: start,
        top: start,
        end: start,
        bottom: start,
      }
    }

    return this
  }

  public offset(x: number, y: number): Omit<this, 'offset'> {
    this.config.offsetX = x
    this.config.offsetY = y
    return this
  }

  public background(background: number): Omit<this, 'background'> {
    this.config.background = background
    return this
  }

  public cornerRadius(radius: number): Omit<this, 'cornerRadius'> {
    this.config.cornerRadius = radius
    return this
  }

  // TODO: consider adding onPointerEnter and onPointerLeave to handle more complex things, although
  // that will require some 'clever' solutions to handle the pointer moving between parent and child
  public onPointerDown(onPointerDown: (event: PointerData) => void): Omit<this, 'onPointerDown'> {
    this.config.onPointerDown = onPointerDown
    return this
  }

  public onPointerMove(onPointerMove: (event: PointerData) => void): Omit<this, 'onPointerMove'> {
    this.config.onPointerMove = onPointerMove
    return this
  }

  public onPointerUp(onPointerUp: (event: PointerData) => void): Omit<this, 'onPointerUp'> {
    this.config.onPointerUp = onPointerUp
    return this
  }
}

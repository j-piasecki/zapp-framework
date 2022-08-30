export function Config(id: string) {
  return new ConfigBuilder(id)
}

export interface Padding {
  top: number
  bottom: number
  start: number
  end: number
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

  text?: string

  // props that may be inherited from the parent
  textSize?: number
  textColor?: number
}

export class ConfigBuilder {
  private config: ConfigType

  constructor(id: string) {
    this.config = {
      id: id,
    }
  }

  public build() {
    return this.config
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

  public background(background: number): Omit<this, 'background'> {
    this.config.background = background
    return this
  }

  public cornerRadius(radius: number): Omit<this, 'cornerRadius'> {
    this.config.cornerRadius = radius
    return this
  }

  public textColor(textColor: number): Omit<this, 'textColor'> {
    this.config.textColor = textColor
    return this
  }

  public textSize(textSize: number): Omit<this, 'cornerRatextSizedius'> {
    this.config.textSize = textSize
    return this
  }
}

import { ViewManager, RenderNode, NodeType, PointerData, PointerEventType, EventManager } from '@zapp/core'

const SVG_NS = 'http://www.w3.org/2000/svg'

export class WebViewManager extends ViewManager {
  private _isRTL?: boolean = undefined

  get screenWidth() {
    return window.innerWidth
  }

  get screenHeight() {
    return window.innerHeight
  }

  private adaptEvent(event: PointerEvent, target: string, type: PointerEventType): PointerData {
    return {
      target: target,
      id: event.pointerId,
      timestamp: event.timeStamp,
      type: type,
      x: event.pageX,
      y: event.pageY,
      capture: () => {
        // TODO: abstract it to EventManager?
        EventManager.capturePointer(event.pointerId, target)
      },
    }
  }

  private pointerDownHandler = (event: PointerEvent, target: string) => {
    EventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.DOWN))
  }

  private pointerMoveHandler = (event: PointerEvent, target: string) => {
    if (event.buttons > 0) {
      EventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.MOVE))
    }
  }

  private pointerUpHandler = (event: PointerEvent, target: string) => {
    EventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.UP))
  }

  private pointerEnterHandler = (event: PointerEvent, target: string) => {
    if (event.buttons > 0) {
      EventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.ENTER))
    }
  }

  private pointerLeaveHandler = (event: PointerEvent, target: string) => {
    if (event.buttons > 0) {
      EventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.LEAVE))
    }
  }

  private colorToRGBA(color: number): string {
    return `rgba(
      ${(color & 0xff0000) >> 16},
      ${(color & 0x00ff00) >> 8},
      ${color & 0x0000ff},
      1
    )`
  }

  createView(node: RenderNode) {
    let view: HTMLElement | SVGElement

    if (node.customViewProps?.createView !== undefined) {
      view = node.customViewProps.createView(node) as HTMLElement
    } else if (node.type === NodeType.Arc) {
      view = document.createElementNS(SVG_NS, 'svg')
      const circle = document.createElementNS(SVG_NS, 'circle')
      const radius = (node.layout.width - node.config.lineWidth!) / 2
      const circumference = 2 * Math.PI * radius
      const strokeOffset = (-node.config.startAngle! / 360) * circumference
      const strokeDasharray = ((node.config.endAngle! - node.config.startAngle!) / 360) * circumference

      circle.setAttribute('cx', `${node.layout.width / 2}`)
      circle.setAttribute('cy', `${node.layout.width / 2}`)
      circle.setAttribute('r', `${radius}`)
      circle.setAttribute('fill', 'transparent')
      circle.setAttribute('stroke', this.colorToRGBA(node.config.borderColor!))
      circle.setAttribute('stroke-width', `${node.config.lineWidth!}`)
      circle.setAttribute('stroke-dasharray', [strokeDasharray, circumference - strokeDasharray].join(','))
      circle.setAttribute('stroke-dashoffset', `${strokeOffset}`)

      view.appendChild(circle)
    } else {
      view = document.createElement('div')
    }

    view.id = node.id
    view.style.position = 'absolute'
    view.style.top = `${node.layout.y}px`
    view.style.left = `${node.layout.x}px`
    view.style.width = `${node.layout.width}px`
    view.style.height = `${node.layout.height}px`
    view.style.boxSizing = 'border-box'

    if (node.config.background !== undefined) {
      view.style.backgroundColor = this.colorToRGBA(node.config.background)
    }

    if (node.config.cornerRadius !== undefined) {
      view.style.borderRadius = `${node.config.cornerRadius}px`
    }

    if (node.config.borderWidth !== undefined) {
      view.style.borderStyle = `solid`
      view.style.borderWidth = `${node.config.borderWidth}px`
    }

    if (node.config.borderColor !== undefined) {
      view.style.borderColor = this.colorToRGBA(node.config.borderColor)
    }

    if (node.type === NodeType.Text) {
      // @ts-ignore
      view.innerText = node.config.text!

      if (node.config.textSize !== undefined) {
        view.style.fontSize = `${node.config.textSize}px`
      }
      if (node.config.textColor !== undefined) {
        view.style.color = this.colorToRGBA(node.config.textColor)
      }
    }

    let handler
    handler = (event: PointerEvent) => this.pointerDownHandler(event, node.id)
    view.addEventListener('pointerdown', handler)

    handler = (event: PointerEvent) => this.pointerMoveHandler(event, node.id)
    view.addEventListener('pointermove', handler)

    handler = (event: PointerEvent) => this.pointerUpHandler(event, node.id)
    view.addEventListener('pointerup', handler)

    handler = (event: PointerEvent) => this.pointerEnterHandler(event, node.id)
    view.addEventListener('pointerenter', handler)

    handler = (event: PointerEvent) => this.pointerLeaveHandler(event, node.id)
    view.addEventListener('pointerout', handler)

    if (node.customViewProps?.overrideViewProps !== undefined) {
      node.customViewProps.overrideViewProps(node, view)
    }

    document.getElementsByTagName('body')[0].appendChild(view)

    return view
  }

  dropView(node: RenderNode): void {
    const view = node.view as HTMLElement
    if (node.customViewProps?.deleteView !== undefined) {
      node.customViewProps.deleteView(node)
    } else {
      view?.remove()
    }
  }

  updateView(previous: RenderNode, next: RenderNode): void {
    const view = next.view as HTMLElement

    if (next.type === NodeType.Arc) {
      const circle = view.getElementsByTagNameNS(SVG_NS, 'circle')[0]
      const radius = (next.layout.width - next.config.lineWidth!) / 2
      const circumference = 2 * Math.PI * radius
      const strokeOffset = (-next.config.startAngle! / 360) * circumference
      const strokeDasharray = ((next.config.endAngle! - next.config.startAngle!) / 360) * circumference

      circle.setAttribute('cx', `${next.layout.width / 2}`)
      circle.setAttribute('cy', `${next.layout.width / 2}`)
      circle.setAttribute('r', `${radius}`)
      circle.setAttribute('fill', 'transparent')
      circle.setAttribute('stroke', this.colorToRGBA(next.config.borderColor!))
      circle.setAttribute('stroke-width', `${next.config.lineWidth!}`)
      circle.setAttribute('stroke-dasharray', [strokeDasharray, circumference - strokeDasharray].join(','))
      circle.setAttribute('stroke-dashoffset', `${strokeOffset}`)
    }

    view.style.position = 'absolute'
    view.style.top = `${next.layout.y}px`
    view.style.left = `${next.layout.x}px`
    view.style.width = `${next.layout.width}px`
    view.style.height = `${next.layout.height}px`

    if (next.config.background !== undefined) {
      view.style.backgroundColor = this.colorToRGBA(next.config.background)
    }

    if (next.config.cornerRadius !== undefined) {
      view.style.borderRadius = `${next.config.cornerRadius}px`
    }

    if (next.config.borderWidth !== undefined) {
      view.style.borderWidth = `${next.config.borderWidth}px`
    } else {
      view.style.borderStyle = 'none'
    }

    if (next.config.borderColor !== undefined) {
      view.style.borderColor = this.colorToRGBA(next.config.borderColor)
    }

    if (next.type === NodeType.Text) {
      view.innerText = next.config.text!

      if (next.config.textSize !== undefined) {
        view.style.fontSize = `${next.config.textSize}px`
      }
      if (next.config.textColor !== undefined) {
        view.style.color = this.colorToRGBA(next.config.textColor)
      }
    }
  }

  measureText(
    text: string,
    node: RenderNode,
    availableWidth: number,
    _availableHeight: number
  ): { width: number; height: number } {
    const wrapper = document.createElement('div')
    const textWrapper = document.createElement('div')

    wrapper.style.width = `${node.layout.width > 0 ? node.layout.width : availableWidth}px`
    if (node.config.textSize !== undefined) {
      wrapper.style.fontSize = `${node.config.textSize}px`
    }
    wrapper.appendChild(textWrapper)
    wrapper.style.position = 'absolute'
    textWrapper.style.position = 'absolute'
    textWrapper.innerText = text

    document.getElementsByTagName('body')[0].appendChild(wrapper)

    const width = textWrapper.clientWidth
    const height = textWrapper.clientHeight

    wrapper.remove()

    // add 2 to width as the text sometimes would get broken anyway ¯\_(ツ)_/¯
    return { width: width + 2, height: height }
  }

  isRTL(): boolean {
    if (this._isRTL === undefined) {
      this._isRTL = window.getComputedStyle(document.getElementsByTagName('body')[0]).direction === 'rtl'
    }

    return this._isRTL
  }
}

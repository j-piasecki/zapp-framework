import { ViewManager, RenderNode, NodeType, PointerData, PointerEventType, EventManager } from '@zapp/core'

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

  createView(node: RenderNode): HTMLElement {
    const view =
      node.customViewProps?.createView !== undefined
        ? (node.customViewProps.createView(node) as HTMLElement)
        : document.createElement('div')

    view.id = node.id
    view.style.position = 'absolute'
    view.style.top = `${node.layout.y}px`
    view.style.left = `${node.layout.x}px`
    view.style.width = `${node.layout.width}px`
    view.style.height = `${node.layout.height}px`

    if (node.config.background !== undefined) {
      view.style.backgroundColor = `rgba(
        ${(node.config.background & 0xff0000) >> 16},
        ${(node.config.background & 0x00ff00) >> 8},
        ${node.config.background & 0x0000ff},
        1
      )`
    }

    if (node.config.cornerRadius !== undefined) {
      view.style.borderRadius = `${node.config.cornerRadius}px`
    }

    if (node.type === NodeType.Text) {
      view.innerText = node.config.text!

      if (node.config.textSize !== undefined) {
        view.style.fontSize = `${node.config.textSize}px`
      }
      if (node.config.textColor !== undefined) {
        view.style.color = `rgba(
          ${(node.config.textColor & 0xff0000) >> 16},
          ${(node.config.textColor & 0x00ff00) >> 8},
          ${node.config.textColor & 0x0000ff},
          1
        )`
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
      node.customViewProps.overrideViewProps(node)
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

    view.style.position = 'absolute'
    view.style.top = `${next.layout.y}px`
    view.style.left = `${next.layout.x}px`
    view.style.width = `${next.layout.width}px`
    view.style.height = `${next.layout.height}px`

    if (next.config.background !== undefined) {
      view.style.backgroundColor = `rgba(
        ${(next.config.background & 0xff0000) >> 16},
        ${(next.config.background & 0x00ff00) >> 8},
        ${next.config.background & 0x0000ff},
        1
      )`
    }

    if (next.config.cornerRadius !== undefined) {
      view.style.borderRadius = `${next.config.cornerRadius}px`
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

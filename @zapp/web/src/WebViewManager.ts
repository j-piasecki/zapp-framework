import { ViewManager, RenderNode, NodeType, PointerData, PointerEventType, EventManager } from '@zapp/core'

export class WebViewManager extends ViewManager {
  private eventListenrs: Map<string, (event: PointerEvent) => void> = new Map()

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
    const view = document.createElement('div')

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

    if (node.config.onPointerDown !== undefined) {
      const handler = (event: PointerEvent) => this.pointerDownHandler(event, node.id)
      this.eventListenrs.set(`${node.id}#pointerdown`, handler)
      view.addEventListener('pointerdown', handler)
    }

    if (node.config.onPointerMove !== undefined) {
      const handler = (event: PointerEvent) => this.pointerMoveHandler(event, node.id)
      this.eventListenrs.set(`${node.id}#pointermove`, handler)
      view.addEventListener('pointermove', handler)
    }

    if (node.config.onPointerUp !== undefined) {
      const handler = (event: PointerEvent) => this.pointerUpHandler(event, node.id)
      this.eventListenrs.set(`${node.id}#pointerup`, handler)
      view.addEventListener('pointerup', handler)
    }

    if (node.config.onPointerEnter !== undefined || node.config.onPointerDown !== undefined) {
      const handler = (event: PointerEvent) => this.pointerEnterHandler(event, node.id)
      this.eventListenrs.set(`${node.id}#pointerenter`, handler)
      view.addEventListener('pointerenter', handler)
    }

    if (node.config.onPointerLeave !== undefined || node.config.onPointerUp !== undefined) {
      const handler = (event: PointerEvent) => this.pointerLeaveHandler(event, node.id)
      this.eventListenrs.set(`${node.id}#pointerleave`, handler)
      view.addEventListener('pointerout', handler)
    }

    document.getElementsByTagName('body')[0].appendChild(view)
    console.log('create', node.id)

    return view
  }

  dropView(node: RenderNode): void {
    const view = node.view as HTMLElement
    view?.remove()

    this.eventListenrs.delete(`${node.id}#'pointerdown'`)
    this.eventListenrs.delete(`${node.id}#'pointermove'`)
    this.eventListenrs.delete(`${node.id}#'pointerup'`)
    this.eventListenrs.delete(`${node.id}#'pointerenter'`)
    this.eventListenrs.delete(`${node.id}#'pointerleave'`)

    console.log('drop', node.id)
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

    if (next.config.onPointerDown === undefined) {
      view.removeEventListener('pointerdown', this.eventListenrs.get(`${next.id}#pointerdown`)!)
      this.eventListenrs.delete(`${next.id}#pointerdown`)
    }

    if (next.config.onPointerMove === undefined) {
      view.removeEventListener('pointermove', this.eventListenrs.get(`${next.id}#pointermove`)!)
      this.eventListenrs.delete(`${next.id}#pointermove`)
    }

    if (next.config.onPointerUp === undefined) {
      view.removeEventListener('pointerup', this.eventListenrs.get(`${next.id}#pointerup`)!)
      this.eventListenrs.delete(`${next.id}#pointerup`)
    }

    if (next.config.onPointerEnter === undefined && next.config.onPointerDown === undefined) {
      view.removeEventListener('pointerenter', this.eventListenrs.get(`${next.id}#pointerenter`)!)
      this.eventListenrs.delete(`${next.id}#pointerenter`)
    }

    if (next.config.onPointerLeave === undefined && next.config.onPointerUp === undefined) {
      view.removeEventListener('pointerout', this.eventListenrs.get(`${next.id}#pointerleave`)!)
      this.eventListenrs.delete(`${next.id}#pointerleave`)
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
    textWrapper.innerText = text

    document.getElementsByTagName('body')[0].appendChild(wrapper)

    const width = textWrapper.clientWidth
    const height = textWrapper.clientHeight

    wrapper.remove()

    return { width: width, height: height }
  }
}

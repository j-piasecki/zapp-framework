import { ViewManager, RenderNode, NodeType } from '@zapp/core'

export class WebViewManager extends ViewManager {
  get screenWidth() {
    return window.innerWidth
  }

  get screenHeight() {
    return window.innerHeight
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

    document.getElementsByTagName('body')[0].appendChild(view)
    console.log('create', node.id)

    return view
  }

  dropView(node: RenderNode): void {
    const view = node.view as HTMLElement
    view?.remove()
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

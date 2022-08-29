import { ViewManager, ConfigType, RenderNode, NodeType } from '@zapp/core'

export class WebViewManager extends ViewManager {
  get screenWidth() {
    return window.innerWidth
  }

  get screenHeight() {
    return window.innerHeight
  }

  createView(node: RenderNode): void {
    node.view = document.createElement('div')

    if (node.type === NodeType.Root) {
      node.view.style.backgroundColor = 'black'
    }

    node.view.style.position = 'absolute'
    node.view.style.top = `${node.layout.y}px`
    node.view.style.left = `${node.layout.x}px`
    node.view.style.width = `${node.layout.width}px`
    node.view.style.height = `${node.layout.height}px`

    if (node.config.background !== undefined) {
      node.view.style.backgroundColor = `rgba(
        ${(node.config.background & 0xff0000) >> 16},
        ${(node.config.background & 0x00ff00) >> 8},
        ${node.config.background & 0x0000ff},
        1
      )`
    }

    if (node.config.cornerRadius !== undefined) {
      node.view.style.borderRadius = `${node.config.cornerRadius}px`
    }

    document.getElementsByTagName('body')[0].appendChild(node.view)
    console.log('create', node.id)
  }

  dropView(node: RenderNode): void {
    node.view?.remove()
    console.log('drop', node.id)
  }

  updateView(previous: RenderNode, next: RenderNode): void {
    if (next.type === NodeType.Root) {
      next.view.style.backgroundColor = 'black'
    }

    next.view.style.position = 'absolute'
    next.view.style.top = `${next.layout.y}px`
    next.view.style.left = `${next.layout.x}px`
    next.view.style.width = `${next.layout.width}px`
    next.view.style.height = `${next.layout.height}px`

    if (next.config.background !== undefined) {
      next.view.style.backgroundColor = `rgba(
        ${(next.config.background & 0xff0000) >> 16},
        ${(next.config.background & 0x00ff00) >> 8},
        ${next.config.background & 0x0000ff},
        1
      )`
    }

    if (next.config.cornerRadius !== undefined) {
      next.view.style.borderRadius = `${next.config.cornerRadius}px`
    }
  }

  measureText(text: string, config: ConfigType): { width: number; height: number } {
    throw new Error('Method not implemented.')
  }
}

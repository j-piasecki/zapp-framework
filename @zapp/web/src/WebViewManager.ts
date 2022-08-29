import { ViewManager, ConfigType, RenderNode } from '@zapp/core'

export class WebViewManager extends ViewManager {
  screenWidth: number
  screenHeight: number
  createView(node: RenderNode): void {
    console.log('web create', node.id)
  }
  dropView(node: RenderNode): void {
    console.log('web drop', node.id)
  }
  updateView(previous: RenderNode, next: RenderNode): void {
    console.log('web update', next.id)
  }
  measureText(text: string, config: ConfigType): { width: number; height: number } {
    throw new Error('Method not implemented.')
  }
}

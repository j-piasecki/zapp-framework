import { RenderNode } from './Renderer.js'

export abstract class ViewManager {
  abstract readonly screenWidth: number
  abstract readonly screenHeight: number

  public abstract createView(node: RenderNode): unknown

  public abstract dropView(node: RenderNode): void

  public abstract updateView(previous: RenderNode, next: RenderNode): void

  public abstract getScrollOffset(): { x: number; y: number }

  public abstract measureText(
    text: string,
    node: RenderNode,
    availableWidth: number,
    availableHeight: number
  ): { width: number; height: number }

  public abstract isRTL(): boolean
}

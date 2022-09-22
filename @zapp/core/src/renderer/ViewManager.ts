import { RenderNode } from './RenderedTree.js'

let viewManagerInstance: ViewManagerInterface

export function setViewManager(viewManager: ViewManagerInterface) {
  viewManagerInstance = viewManager
}

export abstract class ViewManagerInterface {
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

export abstract class ViewManager extends ViewManagerInterface {
  static get screenWidth() {
    return viewManagerInstance.screenWidth
  }

  static get screenHeight() {
    return viewManagerInstance.screenHeight
  }

  public static createView(node: RenderNode): unknown {
    return viewManagerInstance.createView(node)
  }

  public static dropView(node: RenderNode): void {
    viewManagerInstance.dropView(node)
  }

  public static updateView(previous: RenderNode, next: RenderNode): void {
    viewManagerInstance.updateView(previous, next)
  }

  public static getScrollOffset(): { x: number; y: number } {
    return viewManagerInstance.getScrollOffset()
  }

  public static measureText(
    text: string,
    node: RenderNode,
    availableWidth: number,
    availableHeight: number
  ): { width: number; height: number } {
    return viewManagerInstance.measureText(text, node, availableWidth, availableHeight)
  }

  public static isRTL(): boolean {
    return viewManagerInstance.isRTL()
  }
}

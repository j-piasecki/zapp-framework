import { RenderNode, DisplaySizeProvider } from './Renderer.js'

export abstract class ViewManager implements DisplaySizeProvider {
  abstract readonly screenWidth: number
  abstract readonly screenHeight: number

  public abstract createView(node: RenderNode): unknown

  public abstract dropView(node: RenderNode): void

  public abstract updateView(previous: RenderNode, next: RenderNode): void

  public abstract measureText(text: string, node: Node, parent?: Node): { width: number; height: number }
}

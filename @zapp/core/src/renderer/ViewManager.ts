import { ConfigType } from '../working_tree/props/Config.js'
import { RenderNode, DisplaySizeProvider } from './Renderer.js'

export abstract class ViewManager implements DisplaySizeProvider {
  abstract readonly screenWidth: number
  abstract readonly screenHeight: number

  public abstract createView(node: RenderNode): void

  public abstract dropView(node: RenderNode): void

  public abstract updateView(previous: RenderNode, next: RenderNode): void

  public abstract measureText(text: string, config: ConfigType): { width: number; height: number }
}

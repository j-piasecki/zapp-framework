import { ConfigType } from '../working_tree/props/Config.js'
import { Node, DisplaySizeProvider } from './Renderer.js'

export abstract class ViewManager implements DisplaySizeProvider {
  abstract readonly screenWidth: number
  abstract readonly screenHeight: number

  public abstract createView(node: Node): void

  public abstract dropView(node: Node): void

  public abstract updateView(previous: Node, next: Node): void

  public abstract measureText(text: string, config: ConfigType): { width: number; height: number }
}

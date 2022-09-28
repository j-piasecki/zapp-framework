import { NodeType } from '../NodeType.js'
import { ConfigType } from '../working_tree/props/types.js'
import { CustomViewProps } from '../working_tree/views/Custom.js'

export interface Layout {
  width: number
  height: number
  x: number
  y: number
  measured: boolean
  widthInferred: boolean
  heightInferred: boolean
}

export interface RenderNode {
  id: string
  type: NodeType
  config: ConfigType
  children: RenderNode[]
  view: unknown
  zIndex: number
  layout: Layout
  customViewProps?: CustomViewProps
}

export abstract class RenderedTree {
  public static current: RenderNode | null = null
  public static next: RenderNode | null = null

  public static hitTest(x: number, y: number, parent: RenderNode | null = RenderedTree.current): RenderNode | null {
    // TODO: consider handling corner radius
    if (
      parent === null ||
      x < parent.layout.x ||
      x > parent.layout.x + parent.layout.width ||
      y < parent.layout.y ||
      y > parent.layout.y + parent.layout.height
    ) {
      return null
    }

    for (let i = parent.children.length - 1; i >= 0; i--) {
      const result = RenderedTree.hitTest(x, y, parent.children[i])

      if (result !== null) {
        return result
      }
    }

    return parent
  }
}

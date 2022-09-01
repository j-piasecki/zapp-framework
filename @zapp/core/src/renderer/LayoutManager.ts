import { NodeType } from '../NodeType.js'
import { RenderNode } from './Renderer.js'
import { ViewManager } from './ViewManager.js'

export class LayoutManager {
  private viewManager?: ViewManager

  public setViewManager(viewManager: ViewManager) {
    this.viewManager = viewManager
  }

  public calculateLayout(root: RenderNode) {
    this.calculateSize(root, this.viewManager!.screenWidth, this.viewManager!.screenHeight)
    this.calculatePositions(root)
  }

  private calculateSize(node: RenderNode, availableWidth: number, availableHeight: number, parent?: RenderNode) {
    const verticalPadding = (node.config.padding?.top ?? 0) + (node.config.padding?.bottom ?? 0)
    const horizontalPadding = (node.config.padding?.start ?? 0) + (node.config.padding?.end ?? 0)

    const parentVerticalPadding = (parent?.config.padding?.top ?? 0) + (parent?.config.padding?.bottom ?? 0)
    const parentHorizontalPadding = (parent?.config.padding?.start ?? 0) + (parent?.config.padding?.end ?? 0)

    if (node.type === NodeType.Root || node.type === NodeType.Screen) {
      node.layout.width = this.viewManager?.screenWidth ?? 0
      node.layout.height = this.viewManager?.screenHeight ?? 0
    } else if (node.config.fillSize !== undefined) {
      if (parent !== undefined && parent.layout.width !== -1 && parent.layout.height !== -1) {
        node.layout.width = parent.layout.width - parentHorizontalPadding
        node.layout.height = parent.layout.height - parentVerticalPadding
      }
    } else {
      if (node.config.width !== undefined) {
        node.layout.width = node.config.width
      } else if (node.config.fillWidth !== undefined && parent !== undefined && parent.layout.width !== -1) {
        node.layout.width = (parent.layout.width - parentHorizontalPadding) * node.config.fillWidth
      } else if (node.layout.width === -1) {
        if (node.type === NodeType.Column) {
          let height = verticalPadding

          // available width is mainly for text rendering not to overflow any of the predecesors
          const childAvailableWidth =
            (node.layout.width === -1 ? availableWidth : node.layout.width) - horizontalPadding
          const childAvailableHeight =
            (node.layout.width === -1 ? availableHeight : node.layout.height) - verticalPadding
          for (const child of node.children) {
            this.calculateSize(child, childAvailableWidth, childAvailableHeight, node)
            node.layout.width = Math.max(node.layout.width, child.layout.width)
            height += child.layout.height
          }

          node.layout.height = height
          node.layout.width += horizontalPadding
        }
      }

      if (node.config.height !== undefined) {
        node.layout.height = node.config.height
      } else if (node.config.fillHeight !== undefined && parent !== undefined && parent.layout.height !== -1) {
        node.layout.height = (parent.layout.height - parentVerticalPadding) * node.config.fillHeight
      } else if (node.layout.height === -1) {
        if (node.type === NodeType.Row) {
          let width = horizontalPadding

          // available width is mainly for text rendering not to overflow any of the predecesors
          const childAvailableWidth =
            (node.layout.width === -1 ? availableWidth : node.layout.width) - horizontalPadding
          const childAvailableHeight =
            (node.layout.width === -1 ? availableHeight : node.layout.height) - verticalPadding
          for (const child of node.children) {
            this.calculateSize(child, childAvailableWidth, childAvailableHeight, node)
            node.layout.height = Math.max(node.layout.height, child.layout.height)
            width += child.layout.width
          }

          node.layout.width = width
          node.layout.height += verticalPadding
        }
      }
    }

    if (node.type === NodeType.Column && node.layout.height !== -1) {
      let weights = 0
      let absolute = 0

      for (const child of node.children) {
        if (child.config.weight !== undefined) {
          weights += child.config.weight
        } else if (child.layout.height !== -1) {
          absolute += child.layout.height
        }
      }

      if (weights > 0) {
        const weightHeight = (node.layout.height - absolute - verticalPadding) / weights

        for (const child of node.children) {
          if (child.config.weight !== undefined) {
            child.layout.height = weightHeight * child.config.weight
          }
        }
      }
    } else if (node.type === NodeType.Row && node.layout.width !== -1) {
      let weights = 0
      let absolute = 0

      for (const child of node.children) {
        if (child.config.weight !== undefined) {
          weights += child.config.weight
        } else if (child.layout.height !== -1) {
          absolute += child.layout.width
        }
      }

      if (weights > 0) {
        const weightWidth = (node.layout.width - absolute - horizontalPadding) / weights

        for (const child of node.children) {
          if (child.config.weight !== undefined) {
            child.layout.width = weightWidth * child.config.weight
          }
        }
      }
    } else if (node.type === NodeType.Text) {
      const { width, height } = this.viewManager!.measureText(node.config.text!, node, availableWidth, availableHeight)
      node.layout.width = width
      node.layout.height = height
    }

    // available width is mainly for text rendering not to overflow any of the predecesors
    const childAvailableWidth = (node.layout.width === -1 ? availableWidth : node.layout.width) - horizontalPadding
    const childAvailableHeight = (node.layout.width === -1 ? availableHeight : node.layout.height) - verticalPadding
    for (const child of node.children) {
      this.calculateSize(child, childAvailableWidth, childAvailableHeight, node)
    }
  }

  private calculatePositions(node: RenderNode, parent?: RenderNode) {
    // TODO: handle alignment and arrangement

    node.layout.x += node.config.offsetX ?? 0
    node.layout.y += node.config.offsetY ?? 0

    // root is positioned at 0,0 and all other nodes should have a parent
    if (parent !== undefined) {
      if (node.type === NodeType.Column) {
        let nextY = node.layout.y + (node.config.padding?.top ?? 0)

        for (const child of node.children) {
          child.layout.y = nextY
          child.layout.x = (node.config.padding?.start ?? 0) + node.layout.x
          nextY += child.layout.height
        }
      } else if (node.type === NodeType.Row) {
        let nextX = node.layout.x + (node.config.padding?.start ?? 0)

        for (const child of node.children) {
          child.layout.x = nextX
          child.layout.y = (node.config.padding?.top ?? 0) + node.layout.y
          nextX += child.layout.width
        }
      } else {
        for (const child of node.children) {
          child.layout.x = node.layout.x
          child.layout.y = node.layout.y
        }
      }
    }

    for (const child of node.children) {
      this.calculatePositions(child, node)
    }
  }
}

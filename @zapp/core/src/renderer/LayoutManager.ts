import { NodeType } from '../NodeType.js'
import { Node, DisplaySizeProvider } from './Renderer.js'

export class LayoutManager {
  private displaySizeProvider?: DisplaySizeProvider

  public setDisplaySizeProvider(displaySizeProvider: DisplaySizeProvider) {
    this.displaySizeProvider = displaySizeProvider
  }

  public calculateLayout(root: Node) {
    this.calculateSize(root)
    this.calculatePositions(root)
  }

  private calculateSize(node: Node, parent?: Node) {
    if (node.type === NodeType.Root || node.type === NodeType.Screen) {
      node.layout.width = this.displaySizeProvider?.screenWidth ?? 0
      node.layout.height = this.displaySizeProvider?.screenHeight ?? 0
    } else if (node.config.fillSize !== undefined) {
      if (parent !== undefined && parent.layout.width !== -1 && parent.layout.height !== -1) {
        node.layout.width = parent.layout.width
        node.layout.height = parent.layout.height
      }
    } else {
      if (node.config.width !== undefined) {
        node.layout.width = node.config.width
      } else if (node.config.fillWidth !== undefined && parent !== undefined && parent.layout.width !== -1) {
        node.layout.width = parent.layout.width * node.config.fillWidth
      } else if (node.layout.width === -1) {
        if (node.type === NodeType.Column) {
          let height = (node.config.padding?.top ?? 0) + (node.config.padding?.bottom ?? 0)

          for (const child of node.children) {
            this.calculateSize(child, node)
            node.layout.width = Math.max(node.layout.width, child.layout.width)
            height += child.layout.height
          }

          node.layout.height = height
        }
      }

      if (node.config.height !== undefined) {
        node.layout.height = node.config.height
      } else if (node.config.fillHeight !== undefined && parent !== undefined && parent.layout.height !== -1) {
        node.layout.height = parent.layout.height * node.config.fillHeight
      } else if (node.layout.height === -1) {
        if (node.type === NodeType.Row) {
          let width = (node.config.padding?.start ?? 0) + (node.config.padding?.end ?? 0)

          for (const child of node.children) {
            this.calculateSize(child, node)
            node.layout.height = Math.max(node.layout.height, child.layout.height)
            width += child.layout.width
          }

          node.layout.width = width
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
        const weightHeight = (node.layout.height - absolute) / weights

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
        const weightWidth = (node.layout.width - absolute) / weights

        for (const child of node.children) {
          if (child.config.weight !== undefined) {
            child.layout.width = weightWidth * child.config.weight
          }
        }
      }
    }

    for (const child of node.children) {
      this.calculateSize(child, node)
    }
  }

  private calculatePositions(node: Node, parent?: Node) {
    // root is positioned at 0,0 and all other nodes should have a parent
    if (parent !== undefined) {
      if (node.type === NodeType.Column) {
        let nextY = node.config.padding?.top ?? 0

        for (const child of node.children) {
          child.layout.y = nextY
          child.layout.x = (node.config.padding?.start ?? 0) + node.layout.x
          nextY += child.layout.height
        }
      } else if (node.type === NodeType.Row) {
        let nextX = node.config.padding?.start ?? 0

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

import { NodeType } from '../NodeType.js'
import { Alignment, Arrangement, StackAlignment } from '../working_tree/props/types.js'
import { RenderNode } from './Renderer.js'
import { ViewManager } from './ViewManager.js'

export class LayoutManager {
  private viewManager!: ViewManager
  private recalculationStack: RenderNode[]

  public setViewManager(viewManager: ViewManager) {
    this.viewManager = viewManager
  }

  public calculateLayout(root: RenderNode) {
    this.recalculationStack = []

    // split calculating sizes and positions, as measuring views may require double-traversal
    this.calculateSize(root, this.viewManager.screenWidth, this.viewManager.screenHeight)
    this.calculatePositions(root)
  }

  private calculateSize(
    node: RenderNode,
    availableWidth: number,
    availableHeight: number,
    parent?: RenderNode,
    recalculating?: boolean
  ) {
    // special case for root and screen as they always fill all available size
    if (node.type === NodeType.Root || node.type === NodeType.Screen) {
      node.layout.width = this.viewManager?.screenWidth ?? 0
      node.layout.height = this.viewManager?.screenHeight ?? 0

      for (const child of node.children) {
        this.calculateSize(child, availableWidth, availableHeight, node, recalculating)
      }

      return
    }

    if (recalculating !== true) {
      // if not recalculating at the moment, push current node as a candidate for recalculation
      this.recalculationStack.push(node)
    }

    const verticalPadding = (node.config.padding?.top ?? 0) + (node.config.padding?.bottom ?? 0)
    const horizontalPadding = (node.config.padding?.start ?? 0) + (node.config.padding?.end ?? 0)

    const parentVerticalPadding = (parent?.config.padding?.top ?? 0) + (parent?.config.padding?.bottom ?? 0)
    const parentHorizontalPadding = (parent?.config.padding?.start ?? 0) + (parent?.config.padding?.end ?? 0)

    // handle width & height if it's given explicitly or it's dependant on parent's size
    if (node.config.fillSize === true) {
      if (parent!.layout.width !== -1) {
        node.layout.width = parent!.layout.width - parentHorizontalPadding
      }
      if (parent!.layout.height !== -1) {
        node.layout.height = parent!.layout.height - parentVerticalPadding
      }
    } else {
      if (node.config.width !== undefined) {
        node.layout.width = node.config.width
      } else if (node.config.fillWidth !== undefined && parent!.layout.width !== -1) {
        node.layout.width = node.config.fillWidth * (parent!.layout.width - parentHorizontalPadding)
      }

      if (node.config.height !== undefined) {
        node.layout.height = node.config.height
      } else if (node.config.fillHeight !== undefined && parent!.layout.height !== -1) {
        node.layout.height = node.config.fillHeight * (parent!.layout.height - parentVerticalPadding)
      }
    }

    // handle children of column if it's height is known as they may be weighted
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
    }

    // handle children of row if it's width is known as they may be weighted
    if (node.type === NodeType.Row && node.layout.width !== -1) {
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
    }

    // handle text as it may not be sized explicity, in which case we need to measure it with respect
    // to the available space
    if (node.type === NodeType.Text && (node.layout.width === -1 || node.layout.height === -1)) {
      const { width, height } = this.viewManager.measureText(node.config.text!, node, availableWidth, availableHeight)

      if (node.layout.width === -1) {
        node.layout.width = width
      }
      if (node.layout.height === -1) {
        node.layout.height = height
      }
    }

    // calculate available width and height for children, which is used for measuring text when it and its
    // ancestors are not sized explicitly
    const childAvailableWidth = (node.layout.width === -1 ? availableWidth : node.layout.width) - horizontalPadding
    const childAvailableHeight = (node.layout.width === -1 ? availableHeight : node.layout.height) - verticalPadding
    for (const child of node.children) {
      this.calculateSize(child, childAvailableWidth, childAvailableHeight, node)
    }

    // if the size of the node is still unknown, update it after measuring children
    if (node.layout.width === -1 || node.layout.height === -1) {
      if (node.type === NodeType.Column) {
        // column stacks its children one after another vertically so we want its height to be sum of
        // its children heights, while its width needs to match the widest child
        let maxWidth = -1
        let height = verticalPadding

        for (const child of node.children) {
          maxWidth = Math.max(maxWidth, child.layout.width)
          height += child.layout.height
        }

        if (node.layout.height === -1) {
          node.layout.height = height
        }
        if (node.layout.width === -1 && maxWidth !== -1) {
          node.layout.width = Math.max(node.layout.width, maxWidth + horizontalPadding)
        }
      } else if (node.type === NodeType.Row) {
        // column stacks its children one after another horizontally so we want its width to be sum of
        // its children widths, while its height needs to match the highest child
        let width = horizontalPadding
        let maxHeight = -1

        for (const child of node.children) {
          maxHeight = Math.max(maxHeight, child.layout.height)
          width += child.layout.width
        }

        if (node.layout.width === -1) {
          node.layout.width = width
        }
        if (node.layout.height === -1 && maxHeight !== -1) {
          node.layout.height = Math.max(node.layout.height, maxHeight + verticalPadding)
        }
      } else if (node.type === NodeType.Stack) {
        // column stacks its children on top of each other so we want both its width and height to match
        // the widest and highest child respectively
        let maxWidth = -1
        let maxHeight = -1

        for (const child of node.children) {
          maxWidth = Math.max(maxWidth, child.layout.width)
          maxHeight = Math.max(maxHeight, child.layout.height)
        }

        if (node.layout.width === -1 && maxWidth !== -1) {
          node.layout.width = maxWidth + horizontalPadding
        }
        if (node.layout.height === -1 && maxHeight !== -1) {
          node.layout.height = maxHeight + verticalPadding
        }
      }
    }

    if (recalculating !== true) {
      // This algorithm performs a double-pass on parts of the tree when necessary, i.e.:
      // - parent
      //   - node width: 100, fillHeight: 0.5
      //   - node height: 100, fillWidth: 0.5
      // In this case there is enough information to calculate sizes of all nodes, but it cannot be done
      // (at least I couldn't figure it out) in a single pass, so the first pass lets parent infer its size
      // and the second one will correctly size the children with respect to the parent
      // Here's the outline for it:
      // At first visit (recalculating === false) on a node it's pushed to the stack, then there is an
      // attempt to calculate size of it and its children. It may fail to fully measure all descendants,
      // but, assuming the layout is correct, the parent will be able to measure itself. The children that
      // didn't get fully measured will be left on stack after current node. At any moment (during visiting
      // children), all nodes after the current one on the stack are its descendants and after all children
      // are visited, the nodes left on the stack after current one all its direct children that aren't
      // measured.

      // We have two cases: curent view is fully measured, so we can recalculate its children if there are any
      if (node.layout.width !== -1 && node.layout.height !== -1) {
        while (this.recalculationStack[this.recalculationStack.length - 1] !== node) {
          this.calculateSize(this.recalculationStack.pop()!, availableWidth, availableHeight, node, true)
        }
        // the measured view is also popped from stack so it's not measured again in case its siblings do
        this.recalculationStack.pop()
      } else {
        // current view is not fully measured, so we pop all nodes after it (its children) as they will be
        // measured again anyway when visiting again
        while (
          this.recalculationStack.length > 0 &&
          this.recalculationStack[this.recalculationStack.length - 1] !== node
        ) {
          this.recalculationStack.pop()
        }
      }
    }
  }

  private calculatePositions(node: RenderNode, parent?: RenderNode) {
    // TODO: handle alignment and arrangement
    // TODO: handle stack
    node.layout.x += node.config.offsetX ?? 0
    node.layout.y += node.config.offsetY ?? 0

    // root is positioned at 0,0 and all other nodes should have a parent
    if (parent !== undefined) {
      if (node.type === NodeType.Column) {
        this.positionColumn(node)
      } else if (node.type === NodeType.Row) {
        this.positionRow(node)
      } else if (node.type === NodeType.Stack) {
        this.positionStack(node)
      } else {
        for (const child of node.children) {
          child.layout.x = node.layout.x + (node.config.padding?.start ?? 0)
          child.layout.y = node.layout.y + (node.config.padding?.end ?? 0)
        }
      }
    }

    for (const child of node.children) {
      this.calculatePositions(child, node)
    }
  }

  private alignHorizontally(child: RenderNode, parent: RenderNode, alignment?: Alignment) {
    switch (alignment ?? parent.config.alignment) {
      case Alignment.Center:
        child.layout.x = parent.layout.x + (parent.layout.width - child.layout.width) / 2
        break
      case Alignment.End:
        child.layout.x =
          parent.layout.x +
          (this.viewManager.isRTL()
            ? parent.config.padding?.end ?? 0
            : parent.layout.width - child.layout.width - (parent.config.padding?.end ?? 0))
        break
      default:
        child.layout.x =
          parent.layout.x +
          (this.viewManager.isRTL()
            ? parent.layout.width - child.layout.width - (parent.config.padding?.start ?? 0)
            : parent.config.padding?.start ?? 0)
        break
    }
  }

  private alignVertically(child: RenderNode, parent: RenderNode, alignment?: Alignment) {
    switch (alignment ?? parent.config.alignment) {
      case Alignment.Center:
        child.layout.y = parent.layout.y + (parent.layout.height - child.layout.height) / 2
        break
      case Alignment.End:
        child.layout.y =
          parent.layout.y + parent.layout.height - child.layout.height - (parent.config.padding?.bottom ?? 0)
        break
      default:
        child.layout.y = parent.layout.y + (parent.config.padding?.top ?? 0)
        break
    }
  }

  private positionColumn(node: RenderNode) {
    let freeSpace = node.layout.height - (node.config.padding?.top ?? 0) - (node.config.padding?.bottom ?? 0)
    // one pass over children to determine the amount of free space and position children horizontally
    for (const child of node.children) {
      freeSpace -= child.layout.height
      this.alignHorizontally(child, node)
    }

    // second pass to position children vertically depending on the arrangement
    if (node.config.arrangement === undefined || node.config.arrangement === Arrangement.Start) {
      let nextY = node.layout.y + (node.config.padding?.top ?? 0)

      for (const child of node.children) {
        child.layout.y = nextY
        nextY += child.layout.height
      }
    } else if (node.config.arrangement === Arrangement.End) {
      let nextY = node.layout.y + node.layout.height - (node.config.padding?.bottom ?? 0)

      for (let i = node.children.length - 1; i >= 0; i--) {
        const child = node.children[i]
        nextY -= child.layout.height
        child.layout.y = nextY
      }
    } else if (node.config.arrangement === Arrangement.Center) {
      let nextY = node.layout.y + freeSpace / 2

      for (const child of node.children) {
        child.layout.y = nextY
        nextY += child.layout.height
      }
    } else {
      let space = freeSpace / (node.children.length - 1)
      let nextY = node.layout.y + (node.config.padding?.top ?? 0)

      if (node.config.arrangement === Arrangement.SpaceEvenly) {
        space = freeSpace / (node.children.length + 1)
        nextY += space
      } else if (node.config.arrangement === Arrangement.SpaceAround) {
        space = freeSpace / node.children.length
        nextY += space / 2
      }

      for (const child of node.children) {
        child.layout.y = nextY
        nextY += child.layout.height + space
      }
    }
  }

  private positionRow(node: RenderNode) {
    let freeSpace = node.layout.width - (node.config.padding?.start ?? 0) - (node.config.padding?.end ?? 0)
    // one pass over children to determine the amount of free space and position children vertically
    for (const child of node.children) {
      freeSpace -= child.layout.width
      this.alignVertically(child, node)
    }

    // second pass to position children horizontally depending on the arrangement
    if (this.viewManager.isRTL()) {
      if (node.config.arrangement === undefined || node.config.arrangement === Arrangement.Start) {
        let nextX = node.layout.x + node.layout.width - (node.config.padding?.start ?? 0)

        for (const child of node.children) {
          nextX -= child.layout.width
          child.layout.x = nextX
        }
      } else if (node.config.arrangement === Arrangement.End) {
        let nextX = node.layout.x + (node.config.padding?.end ?? 0)

        for (let i = node.children.length - 1; i >= 0; i--) {
          const child = node.children[i]
          child.layout.x = nextX
          nextX += child.layout.width
        }
      } else if (node.config.arrangement === Arrangement.Center) {
        let nextX = node.layout.x + freeSpace / 2

        for (let i = node.children.length - 1; i >= 0; i--) {
          const child = node.children[i]
          child.layout.x = nextX
          nextX += child.layout.width
        }
      } else {
        let space = freeSpace / (node.children.length - 1)
        let nextX = node.layout.x + node.layout.width - (node.config.padding?.start ?? 0)

        if (node.config.arrangement === Arrangement.SpaceEvenly) {
          space = freeSpace / (node.children.length + 1)
          nextX -= space
        } else if (node.config.arrangement === Arrangement.SpaceAround) {
          space = freeSpace / node.children.length
          nextX -= space / 2
        }

        for (const child of node.children) {
          nextX -= child.layout.width
          child.layout.x = nextX
          nextX -= space
        }
      }
    } else {
      if (node.config.arrangement === undefined || node.config.arrangement === Arrangement.Start) {
        let nextX = node.layout.x + (node.config.padding?.start ?? 0)

        for (const child of node.children) {
          child.layout.x = nextX
          nextX += child.layout.width
        }
      } else if (node.config.arrangement === Arrangement.End) {
        let nextX = node.layout.x + node.layout.width - (node.config.padding?.end ?? 0)

        for (let i = node.children.length - 1; i >= 0; i--) {
          const child = node.children[i]
          nextX -= child.layout.width
          child.layout.x = nextX
        }
      } else if (node.config.arrangement === Arrangement.Center) {
        let nextX = node.layout.x + freeSpace / 2

        for (const child of node.children) {
          child.layout.x = nextX
          nextX += child.layout.width
        }
      } else {
        let space = freeSpace / (node.children.length - 1)
        let nextX = node.layout.x + (node.config.padding?.start ?? 0)

        if (node.config.arrangement === Arrangement.SpaceEvenly) {
          space = freeSpace / (node.children.length + 1)
          nextX += space
        } else if (node.config.arrangement === Arrangement.SpaceAround) {
          space = freeSpace / node.children.length
          nextX += space / 2
        }

        for (const child of node.children) {
          child.layout.x = nextX
          nextX += child.layout.width + space
        }
      }
    }
  }

  private positionStack(node: RenderNode) {
    let verticalAlignment = Alignment.Start
    let horizontalAlignment = Alignment.Start

    switch (node.config.stackAlignment) {
      case StackAlignment.TopStart:
      case StackAlignment.TopCenter:
      case StackAlignment.TopEnd:
        verticalAlignment = Alignment.Start
        break

      case StackAlignment.CenterStart:
      case StackAlignment.Center:
      case StackAlignment.CenterEnd:
        verticalAlignment = Alignment.Center
        break

      case StackAlignment.BottomStart:
      case StackAlignment.BottomCenter:
      case StackAlignment.BottomEnd:
        verticalAlignment = Alignment.End
        break
    }

    switch (node.config.stackAlignment) {
      case StackAlignment.TopStart:
      case StackAlignment.CenterStart:
      case StackAlignment.BottomStart:
        horizontalAlignment = Alignment.Start
        break

      case StackAlignment.TopCenter:
      case StackAlignment.Center:
      case StackAlignment.BottomCenter:
        horizontalAlignment = Alignment.Center
        break

      case StackAlignment.TopEnd:
      case StackAlignment.CenterEnd:
      case StackAlignment.BottomEnd:
        horizontalAlignment = Alignment.End
        break
    }

    for (const child of node.children) {
      this.alignHorizontally(child, node, horizontalAlignment)
      this.alignVertically(child, node, verticalAlignment)
    }
  }
}

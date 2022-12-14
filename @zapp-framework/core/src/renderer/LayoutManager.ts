import { NodeType } from '../NodeType.js'
import { Alignment, Arrangement, StackAlignment } from '../working_tree/props/types.js'
import { RenderNode } from './RenderedTree.js'
import { ViewManager } from './ViewManager.js'

export class LayoutManager {
  private recalculationStack: RenderNode[]
  private pageHeight: number

  public calculateLayout(root: RenderNode) {
    this.recalculationStack = []
    this.pageHeight = ViewManager.screenHeight

    // split calculating sizes and positions, as measuring views may require double-traversal
    this.calculateSize(root, ViewManager.screenWidth, ViewManager.screenHeight)
    this.calculatePositions(root)

    // update root height to reflect the potential flexible screen height
    root.layout.height = this.pageHeight
  }

  private calculateSize(
    node: RenderNode,
    availableWidth: number,
    availableHeight: number,
    parent?: RenderNode,
    recalculating?: boolean
  ) {
    // this is more of a workaround than a solution for text taking all available space during
    // first pass, and not adjusting for smaller space during the second one
    if (node.layout.width > availableWidth || node.layout.height > availableHeight) {
      node.layout.width = -1
      node.layout.height = -1
    } else if (node.layout.measured) {
      // in case this node has already been measured, we don't want to continue and recalculate
      // its subtree
      return
    }

    // flag used by different layouts when they don't have enough information about children
    let requiresRecalculation = false
    // when recalculation is forced, the node is calculated again with the same params, unless
    // it would be recalculated normally
    let forceRecalculation = false
    if (recalculating !== true) {
      // if not recalculating at the moment, push current node as a candidate for recalculation
      this.recalculationStack.push(node)
    }

    const verticalPadding = (node.config.padding?.top ?? 0) + (node.config.padding?.bottom ?? 0)
    const horizontalPadding = (node.config.padding?.start ?? 0) + (node.config.padding?.end ?? 0)

    // special case for root and screen as they always fill all available size
    if (node.type === NodeType.Root || node.type === NodeType.Screen) {
      node.layout.width = ViewManager.screenWidth
      node.layout.height = ViewManager.screenHeight

      for (const child of node.children) {
        this.calculateSize(child, availableWidth, availableHeight, node)
      }
    } else {
      const parentVerticalPadding =
        (parent?.config.padding?.top ?? 0) + (parent?.config.padding?.bottom ?? 0)
      const parentHorizontalPadding =
        (parent?.config.padding?.start ?? 0) + (parent?.config.padding?.end ?? 0)

      const totalBorderWidth = (node.config.borderWidth ?? 0) * 2

      // handle width & height if it's given explicitly or it's dependant on parent's size
      if (node.config.width !== undefined) {
        node.layout.width = node.config.width + totalBorderWidth
      } else if (node.config.fillWidth !== undefined) {
        if (parent!.layout.width !== -1) {
          const widthToFill = parent!.layout.widthInferred ? availableWidth : parent!.layout.width
          node.layout.width =
            node.config.fillWidth * (widthToFill - parentHorizontalPadding - totalBorderWidth)
        } else if (recalculating === true && availableWidth !== -1) {
          node.layout.width = node.config.fillWidth * availableWidth
        }
      }

      if (node.config.height !== undefined) {
        node.layout.height = node.config.height + totalBorderWidth
      } else if (node.config.fillHeight !== undefined) {
        if (parent!.layout.height !== -1) {
          const heightToFill = parent!.layout.heightInferred
            ? availableHeight
            : parent!.layout.height
          node.layout.height =
            node.config.fillHeight * (heightToFill - parentVerticalPadding - totalBorderWidth)
        } else if (recalculating === true && availableHeight !== -1) {
          node.layout.height = node.config.fillHeight * availableHeight
        }
      }

      // handle children of column if its height is known as they may be weighted
      if (node.type === NodeType.Column && node.layout.height !== -1) {
        let weights = 0
        let absolute = 0

        for (const child of node.children) {
          if (child.config.weight !== undefined) {
            weights += child.config.weight
          } else if (child.layout.height !== -1) {
            absolute += child.layout.height
          } else {
            // not enough information about children dimensions to calculate weights
            requiresRecalculation = true
            forceRecalculation = true
            break
          }
        }

        if (weights > 0 && !requiresRecalculation) {
          const weightHeight = (node.layout.height - absolute - verticalPadding) / weights

          for (const child of node.children) {
            if (child.config.weight !== undefined) {
              child.layout.height = weightHeight * child.config.weight
              child.layout.heightInferred = false
            }
          }
        }
      }

      // handle children of row if its width is known as they may be weighted
      if (node.type === NodeType.Row && node.layout.width !== -1) {
        let weights = 0
        let absolute = 0

        for (const child of node.children) {
          if (child.config.weight !== undefined) {
            weights += child.config.weight
          } else if (child.layout.width !== -1) {
            absolute += child.layout.width
          } else {
            // not enough information about children dimensions to calculate weights
            requiresRecalculation = true
            forceRecalculation = true
            break
          }
        }

        if (weights > 0 && !requiresRecalculation) {
          const weightWidth = (node.layout.width - absolute - horizontalPadding) / weights

          for (const child of node.children) {
            if (child.config.weight !== undefined) {
              child.layout.width = weightWidth * child.config.weight
              child.layout.widthInferred = false
              child.layout.measured = false
            }
          }
        }
      }

      // handle text as it may not be sized explicity, in which case we need to measure it with respect
      // to the available space
      if (
        node.type === NodeType.Text &&
        (node.layout.width === -1 ||
          node.layout.height === -1 ||
          node.layout.width > availableWidth)
      ) {
        const { width, height } = ViewManager.measureText(
          node.config.text!,
          node,
          availableWidth,
          availableHeight
        )
        node.layout.width = width
        node.layout.height = height
      }

      // calculate available width and height for children, which is used for measuring views when it and its
      // ancestors are not sized explicitly
      const childAvailableWidth =
        (node.layout.width === -1 || node.layout.widthInferred
          ? availableWidth
          : node.layout.width) - horizontalPadding
      const childAvailableHeight =
        (node.layout.height === -1 || node.layout.heightInferred
          ? availableHeight
          : node.layout.height) - verticalPadding

      for (const child of node.children) {
        this.calculateSize(child, childAvailableWidth, childAvailableHeight, node, recalculating)
      }

      // if the size of the node is still unknown, update it after measuring children, assuming it's not sized
      // relative to the parent
      if (
        (node.layout.width === -1 ||
          node.layout.height === -1 ||
          node.layout.widthInferred ||
          node.layout.heightInferred) &&
        (node.config.fillWidth === undefined || node.config.fillHeight === undefined)
      ) {
        if (node.type === NodeType.Column) {
          // column stacks its children one after another vertically so we want its height to be sum of
          // its children heights, while its width needs to match the widest child
          let maxWidth = -1
          let height = verticalPadding

          for (const child of node.children) {
            maxWidth = Math.max(maxWidth, child.layout.width)
            if (child.layout.height !== -1) {
              height += child.layout.height
            }
          }

          if (
            (node.layout.height === -1 || node.layout.heightInferred) &&
            node.config.fillHeight === undefined
          ) {
            node.layout.height = height
            // some of the children may have `fill*` property set, in which case we need to recalculate
            // this subtree so they can correctly fill the remaining available space and this node expands
            // to contain them
            node.layout.heightInferred = true
            requiresRecalculation = true
          }

          if (node.layout.widthInferred) {
            node.layout.width = -1
          }
          if (node.layout.width === -1 && maxWidth !== -1 && node.config.fillWidth === undefined) {
            node.layout.width = Math.max(node.layout.width, maxWidth + horizontalPadding)
            node.layout.widthInferred = true
          }
        } else if (node.type === NodeType.Row) {
          // row stacks its children one after another horizontally so we want its width to be sum of
          // its children widths, while its height needs to match the highest child
          let width = horizontalPadding
          let maxHeight = -1

          for (const child of node.children) {
            maxHeight = Math.max(maxHeight, child.layout.height)
            if (child.layout.width !== -1) {
              width += child.layout.width
            }
          }

          if (
            (node.layout.width === -1 || node.layout.widthInferred) &&
            node.config.fillWidth === undefined
          ) {
            node.layout.width = width
            // some of the children may have `fill*` property set, in which case we need to recalculate
            // this subtree so they can correctly fill the remaining available space and this node expands
            // to contain them
            node.layout.widthInferred = true
            requiresRecalculation = true
          }

          if (node.layout.heightInferred) {
            node.layout.height = -1
          }
          if (
            node.layout.height === -1 &&
            maxHeight !== -1 &&
            node.config.fillHeight === undefined
          ) {
            node.layout.height = Math.max(node.layout.height, maxHeight + verticalPadding)
            node.layout.heightInferred = true
          }
        } else if (node.type === NodeType.Stack || node.type === NodeType.Custom) {
          // stack stacks its children on top of each other so we want both its width and height to match
          // the widest and highest child respectively, we also treat custom views in the same way as stack
          let maxWidth = -1
          let maxHeight = -1

          if (node.layout.widthInferred) {
            node.layout.width = -1
          }
          if (node.layout.heightInferred) {
            node.layout.height = -1
          }

          for (const child of node.children) {
            maxWidth = Math.max(maxWidth, child.layout.width)
            maxHeight = Math.max(maxHeight, child.layout.height)
          }

          if (node.layout.width === -1 && maxWidth !== -1 && node.config.fillWidth === undefined) {
            node.layout.width = maxWidth + horizontalPadding
            node.layout.widthInferred = true
            requiresRecalculation = true
          }
          if (
            node.layout.height === -1 &&
            maxHeight !== -1 &&
            node.config.fillHeight === undefined
          ) {
            node.layout.height = maxHeight + verticalPadding
            node.layout.heightInferred = true
            requiresRecalculation = true
          }
        }
      }
    }

    if (recalculating !== true) {
      if (node.type === NodeType.Screen) {
        // fill the screen if not enough content
        let maxHeight = -1

        for (const child of node.children) {
          maxHeight = Math.max(maxHeight, child.layout.height)
        }

        if (maxHeight !== -1) {
          node.layout.height = Math.max(
            node.layout.height,
            maxHeight + (node.config.padding?.top ?? 0) + (node.config.padding?.bottom ?? 0)
          )
        }
      }

      // This algorithm performs a ~~double-pass~~ a-few-passes on parts of the tree when necessary, i.e.:
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

      // We have two cases: curent view is fully measured, so we can recalculate its children if there are
      // any left on the stack
      if (
        node.layout.width !== -1 &&
        node.layout.height !== -1 &&
        !requiresRecalculation &&
        !forceRecalculation
      ) {
        const childAvailableWidth =
          (node.layout.width === -1 ? availableWidth : node.layout.width) - horizontalPadding
        const childAvailableHeight =
          (node.layout.height === -1 ? availableHeight : node.layout.height) - verticalPadding

        while (this.recalculationStack[this.recalculationStack.length - 1] !== node) {
          this.calculateSize(
            this.recalculationStack.pop()!,
            childAvailableWidth,
            childAvailableHeight,
            node,
            true
          )
        }
        // the measured view is also popped from stack so it's not measured again in case its siblings do
        const measuredNode = this.recalculationStack.pop()!
        // we also mark it as measured in case recalculation happend higher on the tree, in which case we
        // don't want to recalculate this subtree again

        // TODO: measuring text doesn't guarantee correct dimensions, it may use availableWidth when the
        // width of the parent is yet unknown - during the second pass it's possible that text will have
        // larger width than its parent but since it's measured it won't be recalculated
        // this makes it work correctly, but sacrifaces performance by allowing the subtrees containing
        // text nodes to be calculated more than twice
        measuredNode.layout.measured = true
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
    } else if (recalculating === true && forceRecalculation) {
      this.calculateSize(node, availableWidth, availableHeight, parent, true)
    }
  }

  private calculatePositions(node: RenderNode, parent?: RenderNode) {
    if (node.config.isPositionedAbsolutely === true && parent !== undefined) {
      node.layout.x = ViewManager.isRTL()
        ? parent.layout.x + parent.layout.width - node.layout.width
        : parent.layout.x
      node.layout.y = parent.layout.y
    }

    node.layout.x += node.config.offsetX ?? 0
    node.layout.y += node.config.offsetY ?? 0

    // root is positioned at 0,0 and all other nodes should have a parent
    if (parent !== undefined) {
      const borderWidth = node.config.borderWidth ?? 0

      if (node.type === NodeType.Column) {
        this.positionColumn(node)
      } else if (node.type === NodeType.Row) {
        this.positionRow(node)
      } else if (node.type === NodeType.Stack || node.type === NodeType.Screen) {
        this.positionStack(node)
      } else {
        for (const child of node.children) {
          child.layout.x =
            node.layout.x +
            (ViewManager.isRTL()
              ? node.layout.width -
                child.layout.width -
                (node.config.padding?.start ?? 0) -
                borderWidth
              : (node.config.padding?.start ?? 0) + borderWidth)
          child.layout.y = node.layout.y + (node.config.padding?.end ?? 0) + borderWidth
        }
      }
    }

    this.pageHeight = Math.max(this.pageHeight, node.layout.y + node.layout.height)

    for (const child of node.children) {
      this.calculatePositions(child, node)
    }
  }

  private alignHorizontally(child: RenderNode, parent: RenderNode, alignment?: Alignment) {
    switch (alignment ?? parent.config.alignment) {
      case Alignment.Center:
        child.layout.x =
          parent.layout.x +
          (parent.layout.width -
            (parent.config.padding?.end ?? 0) -
            (parent.config.padding?.start ?? 0) -
            child.layout.width) /
            2 +
          (ViewManager.isRTL()
            ? parent.config.padding?.end ?? 0
            : parent.config.padding?.start ?? 0)
        break
      case Alignment.End:
        child.layout.x =
          parent.layout.x +
          (ViewManager.isRTL()
            ? parent.config.padding?.end ?? 0
            : parent.layout.width - child.layout.width - (parent.config.padding?.end ?? 0))
        break
      default:
        child.layout.x =
          parent.layout.x +
          (ViewManager.isRTL()
            ? parent.layout.width - child.layout.width - (parent.config.padding?.start ?? 0)
            : parent.config.padding?.start ?? 0)
        break
    }
  }

  private alignVertically(child: RenderNode, parent: RenderNode, alignment?: Alignment) {
    switch (alignment ?? parent.config.alignment) {
      case Alignment.Center:
        child.layout.y =
          parent.layout.y +
          (parent.layout.height -
            (parent.config.padding?.top ?? 0) -
            (parent.config.padding?.bottom ?? 0) -
            child.layout.height) /
            2 +
          (parent.config.padding?.top ?? 0)
        break
      case Alignment.End:
        child.layout.y =
          parent.layout.y +
          parent.layout.height -
          child.layout.height -
          (parent.config.padding?.bottom ?? 0)
        break
      default:
        child.layout.y = parent.layout.y + (parent.config.padding?.top ?? 0)
        break
    }
  }

  private positionColumn(node: RenderNode) {
    const borderWidth = node.config.borderWidth ?? 0
    let freeSpace =
      node.layout.height -
      (node.config.padding?.top ?? 0) -
      (node.config.padding?.bottom ?? 0) -
      borderWidth * 2
    // one pass over children to determine the amount of free space and position children horizontally
    for (const child of node.children) {
      freeSpace -= child.layout.height
      this.alignHorizontally(child, node)
    }

    // second pass to position children vertically depending on the arrangement
    if (node.config.arrangement === undefined || node.config.arrangement === Arrangement.Start) {
      let nextY = node.layout.y + (node.config.padding?.top ?? 0) + borderWidth

      for (const child of node.children) {
        child.layout.y = nextY
        nextY += child.layout.height
      }
    } else if (node.config.arrangement === Arrangement.End) {
      let nextY =
        node.layout.y + node.layout.height - (node.config.padding?.bottom ?? 0) - borderWidth

      for (let i = node.children.length - 1; i >= 0; i--) {
        const child = node.children[i]
        nextY -= child.layout.height
        child.layout.y = nextY
      }
    } else if (node.config.arrangement === Arrangement.Center) {
      let nextY = node.layout.y + freeSpace / 2 + (node.config.padding?.top ?? 0) + borderWidth

      for (const child of node.children) {
        child.layout.y = nextY
        nextY += child.layout.height
      }
    } else {
      let space = freeSpace / (node.children.length - 1)
      let nextY = node.layout.y + (node.config.padding?.top ?? 0) + borderWidth

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
    const borderWidth = node.config.borderWidth ?? 0
    let freeSpace =
      node.layout.width -
      (node.config.padding?.start ?? 0) -
      (node.config.padding?.end ?? 0) -
      borderWidth * 2
    // one pass over children to determine the amount of free space and position children vertically
    for (const child of node.children) {
      freeSpace -= child.layout.width
      this.alignVertically(child, node)
    }

    // second pass to position children horizontally depending on the arrangement
    if (ViewManager.isRTL()) {
      if (node.config.arrangement === undefined || node.config.arrangement === Arrangement.Start) {
        let nextX =
          node.layout.x + node.layout.width - (node.config.padding?.start ?? 0) - borderWidth

        for (const child of node.children) {
          nextX -= child.layout.width
          child.layout.x = nextX
        }
      } else if (node.config.arrangement === Arrangement.End) {
        let nextX = node.layout.x + (node.config.padding?.end ?? 0) + borderWidth

        for (let i = node.children.length - 1; i >= 0; i--) {
          const child = node.children[i]
          child.layout.x = nextX
          nextX += child.layout.width
        }
      } else if (node.config.arrangement === Arrangement.Center) {
        let nextX = node.layout.x + freeSpace / 2 + (node.config.padding?.start ?? 0) + borderWidth

        for (let i = node.children.length - 1; i >= 0; i--) {
          const child = node.children[i]
          child.layout.x = nextX
          nextX += child.layout.width
        }
      } else {
        let space = freeSpace / (node.children.length - 1)
        let nextX =
          node.layout.x + node.layout.width - (node.config.padding?.start ?? 0) - borderWidth

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
        let nextX = node.layout.x + (node.config.padding?.start ?? 0) + borderWidth

        for (const child of node.children) {
          child.layout.x = nextX
          nextX += child.layout.width
        }
      } else if (node.config.arrangement === Arrangement.End) {
        let nextX =
          node.layout.x + node.layout.width - (node.config.padding?.end ?? 0) - borderWidth

        for (let i = node.children.length - 1; i >= 0; i--) {
          const child = node.children[i]
          nextX -= child.layout.width
          child.layout.x = nextX
        }
      } else if (node.config.arrangement === Arrangement.Center) {
        let nextX = node.layout.x + freeSpace / 2 + (node.config.padding?.start ?? 0) + borderWidth

        for (const child of node.children) {
          child.layout.x = nextX
          nextX += child.layout.width
        }
      } else {
        let space = freeSpace / (node.children.length - 1)
        let nextX = node.layout.x + (node.config.padding?.start ?? 0) + borderWidth

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

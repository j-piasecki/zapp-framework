import { ViewManager, RenderNode, NodeType, PointerData, PointerEventType, PointerEventManager } from '@zapp/core'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = hmSetting.getDeviceInfo()

interface ViewHolder {
  view: any
  border?: any
}

export class WatchViewManager extends ViewManager {
  private _isRTL?: boolean = undefined

  get screenWidth() {
    return DEVICE_WIDTH
  }

  get screenHeight() {
    return DEVICE_HEIGHT
  }

  private adaptEvent(event: any, target: string, type: PointerEventType): PointerData {
    const { x: scrollX, y: scrollY } = this.getScrollOffset()
    return {
      target: target,
      id: event.id,
      timestamp: event.timeStamp,
      type: type,
      x: event.x + scrollX,
      y: event.y + scrollY,
      capture: () => {
        // TODO: abstract it to PointerEventManager?
        PointerEventManager.capturePointer(event.id, target)
      },
    }
  }

  private pointerDownHandler = (event: PointerEvent, target: string) => {
    PointerEventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.DOWN))
  }

  private pointerMoveHandler = (event: PointerEvent, target: string) => {
    PointerEventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.MOVE))
  }

  private pointerUpHandler = (event: PointerEvent, target: string) => {
    PointerEventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.UP))
  }

  private pointerEnterHandler = (event: PointerEvent, target: string) => {
    PointerEventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.ENTER))
  }

  private pointerLeaveHandler = (event: PointerEvent, target: string) => {
    PointerEventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.LEAVE))
  }

  createView(node: RenderNode) {
    let viewHolder: ViewHolder

    if (node.customViewProps?.createView !== undefined) {
      viewHolder = { view: node.customViewProps.createView(node) }
    } else {
      if (node.type === NodeType.Text) {
        viewHolder = {
          view: hmUI.createWidget(hmUI.widget.TEXT, {
            x: node.layout.x,
            y: node.layout.y,
            w: node.layout.width,
            h: node.layout.height,
            color: node.config.textColor,
            text_size: node.config.textSize,
            align_h: hmUI.align.TOP,
            align_v: hmUI.align.LEFT,
            text_style: hmUI.text_style.WRAP,
            text: node.config.text,
          }),
        }
      } else if (node.type === NodeType.Arc) {
        viewHolder = {
          view: hmUI.createWidget(hmUI.widget.ARC, {
            x: node.layout.x,
            y: node.layout.y,
            w: node.layout.width,
            h: node.layout.height,
            start_angle: node.config.startAngle,
            end_angle: node.config.endAngle,
            color: node.config.borderColor,
            line_width: node.config.lineWidth,
          }),
        }
      } else if (node.type === NodeType.Image) {
        viewHolder = {
          view: hmUI.createWidget(hmUI.widget.IMG, {
            x: node.layout.x,
            y: node.layout.y,
            w: node.layout.width,
            h: node.layout.height,
            pos_x: node.config.innerOffsetX,
            pos_y: node.config.innerOffsetY,
            center_x: node.config.originX,
            center_y: node.config.originY,
            src: node.config.source,
            angle: node.config.rotation,
          }),
        }
      } else {
        viewHolder = {
          view: hmUI.createWidget(hmUI.widget.FILL_RECT, {
            x: node.layout.x,
            y: node.layout.y,
            w: node.layout.width,
            h: node.layout.height,
            radius: node.config.cornerRadius,
            color: node.config.background,
          }),
        }

        if (node.config.borderWidth !== undefined && node.config.borderWidth > 0) {
          viewHolder.border = hmUI.createWidget(hmUI.widget.STROKE_RECT, {
            x: node.layout.x,
            y: node.layout.y,
            w: node.layout.width,
            h: node.layout.height,
            radius: node.config.cornerRadius,
            color: node.config.borderColor ?? 0,
            line_width: node.config.borderWidth,
          })
        }
      }
    }

    let handler
    handler = (event: PointerEvent) => this.pointerDownHandler(event, node.id)
    viewHolder.view.addEventListener(hmUI.event.CLICK_DOWN, handler)
    viewHolder.border?.addEventListener(hmUI.event.CLICK_DOWN, handler)

    handler = (event: PointerEvent) => this.pointerMoveHandler(event, node.id)
    viewHolder.view.addEventListener(hmUI.event.MOVE, handler)
    viewHolder.border?.addEventListener(hmUI.event.MOVE, handler)

    handler = (event: PointerEvent) => this.pointerUpHandler(event, node.id)
    viewHolder.view.addEventListener(hmUI.event.CLICK_UP, handler)
    viewHolder.border?.addEventListener(hmUI.event.CLICK_UP, handler)

    // Those two seem not to be be sent by the os...
    handler = (event: PointerEvent) => this.pointerEnterHandler(event, node.id)
    viewHolder.view.addEventListener(hmUI.event.MOVE_IN, handler)
    viewHolder.border?.addEventListener(hmUI.event.MOVE_IN, handler)

    handler = (event: PointerEvent) => this.pointerLeaveHandler(event, node.id)
    viewHolder.view.addEventListener(hmUI.event.MOVE_OUT, handler)
    viewHolder.border?.addEventListener(hmUI.event.MOVE_OUT, handler)

    if (node.customViewProps?.overrideViewProps !== undefined) {
      node.customViewProps.overrideViewProps(node, viewHolder.view)
    }

    return viewHolder
  }

  dropView(node: RenderNode): void {
    const viewHolder = node.view as ViewHolder

    if (node.customViewProps?.deleteView !== undefined) {
      node.customViewProps.deleteView(viewHolder.view)
    } else {
      hmUI.deleteWidget(viewHolder.view)

      if (viewHolder.border !== undefined) {
        hmUI.deleteWidget(viewHolder.border)
      }
    }
  }

  updateView(previous: RenderNode, next: RenderNode): void {
    const viewHolder = next.view as ViewHolder

    if (next.customViewProps?.updateView !== undefined) {
      next.customViewProps.updateView(previous, next, viewHolder.view)
    } else if (next.type === NodeType.Text) {
      viewHolder.view.setProperty(hmUI.prop.MORE, {
        x: next.layout.x,
        y: next.layout.y,
        w: next.layout.width,
        h: next.layout.height,
        color: next.config.textColor,
        text_size: next.config.textSize,
        align_h: hmUI.align.TOP,
        align_v: hmUI.align.LEFT,
        text_style: hmUI.text_style.WRAP,
        text: next.config.text,
      })
    } else if (next.type === NodeType.Arc) {
      viewHolder.view.setProperty(hmUI.prop.MORE, {
        x: next.layout.x,
        y: next.layout.y,
        w: next.layout.width,
        h: next.layout.height,
        start_angle: next.config.startAngle,
        end_angle: next.config.endAngle,
        color: next.config.borderColor,
        line_width: next.config.lineWidth,
      })
    } else if (next.type === NodeType.Image) {
      viewHolder.view.setProperty(hmUI.prop.MORE, {
        x: next.layout.x,
        y: next.layout.y,
        w: next.layout.width,
        h: next.layout.height,
        pos_x: next.config.innerOffsetX,
        pos_y: next.config.innerOffsetY,
        center_x: next.config.originX,
        center_y: next.config.originY,
        src: next.config.source,
        angle: next.config.rotation,
      })
    } else {
      viewHolder.view.setProperty(hmUI.prop.MORE, {
        x: next.layout.x,
        y: next.layout.y,
        w: next.layout.width,
        h: next.layout.height,
        radius: next.config.cornerRadius,
        color: next.config.background,
      })

      if (viewHolder.border !== undefined) {
        if (next.config.borderWidth === undefined || next.config.borderWidth <= 0) {
          // delete the border view as it has a minimum width of 1 and we don't want to see it
          // if needed it will be recreated by the Renderer
          hmUI.deleteWidget(viewHolder.border)
          viewHolder.border = undefined
        } else {
          viewHolder.border.setProperty(hmUI.prop.MORE, {
            x: next.layout.x,
            y: next.layout.y,
            w: next.layout.width,
            h: next.layout.height,
            radius: next.config.cornerRadius,
            color: next.config.borderColor ?? 0,
            line_width: next.config.borderWidth ?? 0,
          })
        }
      }
    }
  }

  getScrollOffset() {
    return { x: 0, y: 0 }
  }

  measureText(
    text: string,
    node: RenderNode,
    availableWidth: number,
    _availableHeight: number
  ): { width: number; height: number } {
    // this is some kind of not funny joke...
    // when measuring text with wrapped: 1, it works as long as the text actually gets wrapped
    // it it doesn't then the returned width i -1...
    const res = hmUI.getTextLayout(text, {
      text_size: node.config.textSize,
      text_width: availableWidth,
      wrapped: 1,
    })

    if (res.width === -1) {
      // ...on the other hand, when measuting with wrapped: 0, the returned height is too small
      // resulting in clipped text when drawing...
      const secondMeasure = hmUI.getTextLayout(text, {
        text_size: node.config.textSize,
        text_width: availableWidth,
        wrapped: 0,
      })

      // ...so the optimal solution would be to combine the two
      res.width = secondMeasure.width
      // but it doesn't work anyway, since it seems like the actual rendering of the text is
      // performed differently than measuring and even though there is enough space to draw text
      // it tries to break the line, rendering out of bounds

      // TODO: consider measuring & drawing text from line by line from scratch to have it working
      // somewhat reliably
    }

    return res
  }

  isRTL(): boolean {
    if (this._isRTL === undefined) {
      this._isRTL = hmUI.getRtlLayout() as boolean
    }

    return this._isRTL
  }
}

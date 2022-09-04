import { ViewManager, RenderNode, NodeType, PointerData, PointerEventType, EventManager } from '@zapp/core'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = hmSetting.getDeviceInfo()

export class WatchViewManager extends ViewManager {
  private _isRTL?: boolean = undefined

  get screenWidth() {
    return DEVICE_WIDTH
  }

  get screenHeight() {
    return DEVICE_HEIGHT
  }

  private adaptEvent(event: any, target: string, type: PointerEventType): PointerData {
    return {
      target: target,
      id: event.id,
      timestamp: event.timeStamp,
      type: type,
      x: event.x, // TODO: handle scrolling correctly
      y: event.y,
      capture: () => {
        // TODO: abstract it to EventManager?
        EventManager.capturePointer(event.id, target)
      },
    }
  }

  private pointerDownHandler = (event: PointerEvent, target: string) => {
    EventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.DOWN))
  }

  private pointerMoveHandler = (event: PointerEvent, target: string) => {
    EventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.MOVE))
  }

  private pointerUpHandler = (event: PointerEvent, target: string) => {
    EventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.UP))
  }

  private pointerEnterHandler = (event: PointerEvent, target: string) => {
    EventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.ENTER))
  }

  private pointerLeaveHandler = (event: PointerEvent, target: string) => {
    EventManager.queueEvent(this.adaptEvent(event, target, PointerEventType.LEAVE))
  }

  createView(node: RenderNode) {
    let view

    if (node.customViewProps?.createView !== undefined) {
      view = node.customViewProps.createView(node)
    } else {
      if (node.type === NodeType.Text) {
        view = hmUI.createWidget(hmUI.widget.TEXT, {
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
        })
      } else {
        view = hmUI.createWidget(hmUI.widget.FILL_RECT, {
          x: node.layout.x,
          y: node.layout.y,
          w: node.layout.width,
          h: node.layout.height,
          radius: node.config.cornerRadius,
          color: node.config.background,
        })
      }
    }

    let handler
    handler = (event: PointerEvent) => this.pointerDownHandler(event, node.id)
    view.addEventListener(hmUI.event.CLICK_DOWN, handler)

    handler = (event: PointerEvent) => this.pointerMoveHandler(event, node.id)
    view.addEventListener(hmUI.event.MOVE, handler)

    handler = (event: PointerEvent) => this.pointerUpHandler(event, node.id)
    view.addEventListener(hmUI.event.CLICK_UP, handler)

    // Those two seem not to be be sent by the os...
    handler = (event: PointerEvent) => this.pointerEnterHandler(event, node.id)
    view.addEventListener(hmUI.event.MOVE_IN, handler)

    handler = (event: PointerEvent) => this.pointerLeaveHandler(event, node.id)
    view.addEventListener(hmUI.event.MOVE_OUT, handler)

    if (node.customViewProps?.overrideViewProps !== undefined) {
      node.customViewProps.overrideViewProps(node, view)
    }

    return view
  }

  dropView(node: RenderNode): void {
    if (node.customViewProps?.deleteView !== undefined) {
      node.customViewProps.deleteView(node)
    } else {
      hmUI.deleteWidget(node.view)
    }
  }

  updateView(previous: RenderNode, next: RenderNode): void {
    const view = next.view as any

    if (next.customViewProps?.updateView !== undefined) {
      next.customViewProps.updateView(previous, next)
    } else if (next.type === NodeType.Text) {
      // @ts-ignore
      view.setProperty(hmUI.prop.MORE, {
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
    } else {
      // @ts-ignore
      view.setProperty(hmUI.prop.MORE, {
        x: next.layout.x,
        y: next.layout.y,
        w: next.layout.width,
        h: next.layout.height,
        radius: next.config.cornerRadius,
        color: next.config.background,
      })
    }
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

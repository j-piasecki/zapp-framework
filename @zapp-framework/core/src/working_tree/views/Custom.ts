import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { NodeType } from '../../NodeType.js'
import { RenderNode } from '../../renderer/RenderedTree.js'
import { ConfigBuilder } from '../props/Config.js'

export interface CustomViewProps extends Record<string, unknown> {
  /**
   * invoked when the node is dropped from the tree
   */
  dropHandler?: () => void

  /**
   * invoked when the view enters the view hierarchy, when implemented itmust return a
   * reference to the created view
   */
  createView?: (config: RenderNode) => unknown

  /**
   * invoked after the ViewManager finishes setting up the newly created view, it may
   * be used to overwrite them
   */
  overrideViewProps?: (config: RenderNode, view: unknown) => void

  /**
   * invoked during update, receives previous and the next node
   */
  updateView?: (previous: RenderNode, next: RenderNode, view: unknown) => void

  /**
   * invoked when the view leaves the view hierarchy, when implemented it must delete the created
   * view (note that this method may be called without calling dropHandler to reorder views)
   */
  deleteView?: (view: unknown) => void
}

export function Custom(
  configBuilder: ConfigBuilder,
  customViewProps: CustomViewProps,
  body?: () => void
) {
  const config = configBuilder.build()
  const current = WorkingTree.current as ViewNode

  const context = WorkingTree.create(
    current,
    {
      id: config.id,
      type: NodeType.Custom,
      config: config,
      body: body,
    },
    customViewProps
  )

  current.children.push(context)

  WorkingTree.withContext(context, body)
}

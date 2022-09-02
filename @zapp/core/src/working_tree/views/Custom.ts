import type { RequireSome } from '../../utils.js'
import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { NodeType } from '../../NodeType.js'
import { ConfigBuilder } from '../props/Config.js'
import { RenderNode } from '../../renderer/Renderer.js'

export interface CustomViewProps extends Record<string, unknown> {
  dropHandler?: () => void
  createView?: (config: RenderNode) => unknown
  overrideViewProps?: (config: RenderNode) => void
  updateView?: (previous: RenderNode, next: RenderNode) => void
  deleteView?: (config: RenderNode) => void
}

export function Custom(
  configBuilder: RequireSome<ConfigBuilder, 'build'>,
  customViewProps: CustomViewProps,
  body: () => void
) {
  const config = configBuilder.build()
  const current = WorkingTree.current as ViewNode

  const context = current.create(
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

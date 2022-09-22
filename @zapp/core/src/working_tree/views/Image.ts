import type { RequireSome } from '../../utils.js'
import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { NodeType } from '../../NodeType.js'
import { ConfigBuilder } from '../props/Config.js'

export function Image(configBuilder: RequireSome<ConfigBuilder, 'build'>, source: string) {
  const config = configBuilder.build()
  config.source = source
  const current = WorkingTree.current as ViewNode

  const context = WorkingTree.create(current, {
    id: config.id,
    type: NodeType.Image,
    config: config,
  })

  current.children.push(context)
}

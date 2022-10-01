import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { NodeType } from '../../NodeType.js'
import { ConfigBuilder } from '../props/Config.js'

export function Row(configBuilder: ConfigBuilder, body?: () => void) {
  const config = configBuilder.build()
  const current = WorkingTree.current as ViewNode

  const context = WorkingTree.create(current, {
    id: config.id,
    type: NodeType.Row,
    config: config,
    body: body,
  })

  current.children.push(context)

  WorkingTree.withContext(context, body)
}

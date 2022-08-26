import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { NodeType } from '../../NodeType.js'

export function Row(config: any, body: () => void) {
  const current = WorkingTree.current as ViewNode

  const context = current.create({
    id: config.id,
    type: NodeType.Row,
    config: config,
    body: body,
  })

  current.children.push(context)

  WorkingTree.withContext(context, body)
}

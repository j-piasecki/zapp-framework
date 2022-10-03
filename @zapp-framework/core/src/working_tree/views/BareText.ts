import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { NodeType } from '../../NodeType.js'
import { ConfigBuilder } from '../props/Config.js'

export function BareText(configBuilder: ConfigBuilder, text: string) {
  const config = configBuilder.build()
  config.text = text
  const current = WorkingTree.current as ViewNode

  const context = WorkingTree.create(current, {
    id: config.id,
    type: NodeType.Text,
    config: config,
  })

  current.children.push(context)
}

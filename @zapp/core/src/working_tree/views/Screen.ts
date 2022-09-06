import type { RequireSome } from '../../utils.js'
import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { NodeType } from '../../NodeType.js'
import { ConfigBuilder } from '../props/Config.js'

export function ScreenBody(
  configBuilder: RequireSome<ConfigBuilder, 'build'>,
  body?: (params?: Record<string, unknown>) => void
) {
  const config = configBuilder.build()
  const current = WorkingTree.current as ViewNode

  const context = current.create({
    id: config.id,
    type: NodeType.Screen,
    config: config,
    body: body,
  })

  current.children.push(context)

  WorkingTree.withContext(context, body)
}

let screenImplementation = (
  configBuilder: RequireSome<ConfigBuilder, 'build'>,
  body?: (params?: Record<string, unknown>) => void
) => {
  ScreenBody(configBuilder, body)
}

export function setScreenImplementation(
  implementation: (
    config: RequireSome<ConfigBuilder, 'build'>,
    body?: (params?: Record<string, unknown>) => void
  ) => void
) {
  screenImplementation = implementation
}

export function Screen(
  configBuilder: RequireSome<ConfigBuilder, 'build'>,
  body?: (params?: Record<string, unknown>) => void
) {
  screenImplementation(configBuilder, body)
}

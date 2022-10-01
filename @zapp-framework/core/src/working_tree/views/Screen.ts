import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { NodeType } from '../../NodeType.js'
import { Zapp } from '../../ZappInterface.js'
import { ConfigBuilder } from '../props/Config.js'

export function ScreenBody(
  configBuilder: ConfigBuilder,
  body?: (params?: Record<string, unknown>) => void
) {
  const config = configBuilder.build()
  if (config.background === undefined) {
    // @ts-ignore
    config.background = Zapp.getValue('zapp#theme')?.background ?? 0x000000
  }

  const current = WorkingTree.current as ViewNode

  const context = WorkingTree.create(current, {
    id: config.id,
    type: NodeType.Screen,
    config: config,
    body: body,
  })

  current.children.push(context)

  WorkingTree.withContext(context, body)
}

let simpleScreenImplementation = (
  configBuilder: ConfigBuilder,
  body?: (params?: Record<string, unknown>) => void
) => {
  ScreenBody(configBuilder, body)
}

export function setSimpleScreenImplementation(
  implementation: (config: ConfigBuilder, body?: (params?: Record<string, unknown>) => void) => void
) {
  simpleScreenImplementation = implementation
}

export function SimpleScreen(
  configBuilder: ConfigBuilder,
  body?: (params?: Record<string, unknown>) => void
) {
  simpleScreenImplementation(configBuilder, body)
}

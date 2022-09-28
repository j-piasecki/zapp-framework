import { ViewNode } from '../ViewNode.js'
import { WorkingTree } from '../WorkingTree.js'
import { Navigator } from '../../Navigator.js'

type CallbackType = (result: Record<string, unknown> | undefined) => void

interface LauncherForResult {
  launch: (params?: Record<string, unknown>) => void
}

export function rememberLauncherForResult(page: string, callback: CallbackType): LauncherForResult {
  const current = WorkingTree.current as ViewNode
  const context = WorkingTree.remember(current)

  const result = Navigator.tryPoppingLauncherResult(page, context.path.concat(context.id))
  if (result !== undefined && result.ready) {
    callback(result.result)
  }

  // we don't need to push created node to parent context as we only need the path to trigger
  // the correct callback when the opened screen finishes

  return {
    launch: (params: Record<string, unknown>) => {
      Navigator.registerResultCallback(page, context.path.concat(context.id))
      Navigator.navigate(page, params)
    },
  }
}

import { NodeType } from '../NodeType.js'
import { ConfigType } from './props/types'
import { EffectNode } from './EffectNode.js'
import { RememberNode } from './RememberNode.js'
import { WorkingNode, WorkingNodeProps } from './WorkingNode.js'
import { WorkingTree } from './WorkingTree.js'
import { findRelativePath } from '../utils.js'
import { CustomViewProps } from './views/Custom.js'

export interface ViewNodeProps extends WorkingNodeProps {
  body: () => void
  config: ConfigType
}

export class ViewNode extends WorkingNode {
  public body: () => void
  public children: WorkingNode[]
  public config: ConfigType

  // used for remembering values and during recomposing
  public override: ViewNode | undefined
  public nextActionId: number
  public rememberedContext: ViewNode | undefined

  // custom view properties
  public customViewProps?: CustomViewProps

  constructor(props: ViewNodeProps) {
    super(props)

    this.body = props.body
    this.children = []
    this.config = props.config

    this.nextActionId = 0
  }

  public create(props: ViewNodeProps, customViewProps?: CustomViewProps) {
    const result = new ViewNode(props)

    // new view nodes may only be created inside another view node
    const currentView = WorkingTree.current as ViewNode

    result.customViewProps = customViewProps
    result.parent = currentView.override ?? WorkingTree.current
    result.rememberedContext = currentView.rememberedContext
    result.path = this.path.concat(this.id)

    return result
  }

  public remember() {
    // remember may only be called inside view node
    const currentView = WorkingTree.current as ViewNode

    const result = new RememberNode({
      id: (currentView.nextActionId++).toString(),
      type: NodeType.Remember,
    })

    result.parent = currentView.override ?? WorkingTree.current
    result.path = this.path.concat(this.id)

    return result
  }

  public effect() {
    // effects may only be created inside view node
    const currentView = WorkingTree.current as ViewNode

    const result = new EffectNode({
      id: (currentView.nextActionId++).toString(),
      type: NodeType.Effect,
    })

    result.parent = currentView.override ?? WorkingTree.current
    result.path = this.path.concat(this.id)

    return result
  }

  public override reset(): void {
    this.rememberedContext = undefined
    this.override = undefined
  }

  public override drop(newSubtreeRoot: WorkingNode): void {
    super.drop(newSubtreeRoot)

    if (this.type === NodeType.Custom && this.customViewProps?.dropHandler !== undefined) {
      const thisPath = this.path.concat(this.id)
      const relativePath = findRelativePath(thisPath, newSubtreeRoot.path)

      if (relativePath !== null) {
        const nodeAtPath = newSubtreeRoot.getNodeFromPath(relativePath)
        if (nodeAtPath === null) {
          this.customViewProps.dropHandler()
        }
      }
    }

    for (const child of this.children) {
      child.drop(newSubtreeRoot)
    }
  }
}

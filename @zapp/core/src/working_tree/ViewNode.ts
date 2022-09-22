import { NodeType } from '../NodeType.js'
import { ConfigType } from './props/types'
import { WorkingNode, WorkingNodeProps } from './WorkingNode.js'
import { findRelativePath } from '../utils.js'
import { CustomViewProps } from './views/Custom.js'

export interface ViewNodeProps extends WorkingNodeProps {
  body?: () => void
  config: ConfigType
}

export class ViewNode extends WorkingNode {
  public body?: () => void
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

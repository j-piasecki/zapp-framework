import { NodeType } from '../NodeType.js'

export interface WorkingNodeProps {
  id: string
  type: NodeType
}

export abstract class WorkingNode {
  public id: string
  public type: NodeType
  public parent: WorkingNode | null
  public path: string[]
  public isDropped: boolean

  constructor(props: WorkingNodeProps) {
    this.id = props.id
    this.type = props.type
    this.parent = null
    this.path = []
    this.isDropped = false
  }

  public getNodeFromPath(path: string[]): WorkingNode | null {
    let current = this
    let index = 0
    if (path[index] === current.id) {
      index++ // skip root
    }

    while (index < path.length) {
      const id = path[index++]
      // @ts-ignore children doesn't exist on remember nodes, but those don't have children anyway
      const children = current.children ?? []
      let found = false

      for (const node of children) {
        if (node.id === id) {
          current = node
          found = true
          break
        }
      }

      if (!found) {
        return null
      }
    }

    return current
  }

  public reset() {}

  public drop(_newSubtreeRoot: WorkingNode) {
    this.isDropped = true
  }

  public show() {
    console.log(this.toString())
  }

  public toString() {
    return JSON.stringify(
      this,
      (k, v) => {
        switch (k) {
          case 'id':
          case 'type':
          case 'config':
          case 'rememberIndex':
          case 'keys':
            return v
          case 'path':
            return v.join('/')
          case 'body':
            return v !== undefined ? 'body' : 'no body'
          case 'override':
            return v !== undefined ? 'override' : 'no override'
          case 'parent':
            return v?.id ?? 'no parent'
          case 'remembered':
            return { value: v.value, animation: v._animation }
          case 'rememberedContext':
            return v !== undefined ? 'remembered context' : 'no remembered context'
          case 'effectCleanup':
            return v !== undefined ? 'cleanup' : 'no cleanup'
          case 'animation':
            return v !== undefined ? 'animation' : 'no animation'
          default:
            return v
        }
      },
      2
    )
  }
}

interface Node {
  value: string
  last: boolean
  children: Map<string, Node>
}

export class PrefixTree {
  private root: Node | undefined

  addPath(path: string[]) {
    const key = path.shift()

    if (this.root === undefined && key !== undefined) {
      this.root = {
        value: key,
        last: path.length === 0,
        children: new Map(),
      }
    }

    if (path.length > 0) {
      this.appendToNode(this.root!, path)
    }
  }

  private appendToNode(node: Node, path: string[]) {
    const key = path.shift()
    if (key !== undefined) {
      if (node.children.get(key) === undefined) {
        node.children.set(key, {
          value: key,
          last: path.length === 0,
          children: new Map(),
        })
      }

      if (path.length > 0) {
        this.appendToNode(node.children.get(key)!, path)
      } else {
        node.children.get(key)!.last = true
      }
    }
  }

  getPaths(): string[][] {
    if (this.root === undefined) {
      return []
    }

    return this.getNodePaths(this.root)
  }

  private getNodePaths(node: Node): string[][] {
    if (node.last || node.children.size === 0) {
      return [[node.value]]
    }

    const result: string[][] = []

    for (const [_, child] of node.children) {
      const childPaths = this.getNodePaths(child)

      childPaths.forEach((path) => {
        path.unshift(node.value)

        result.push(path)
      })
    }

    return result
  }

  clear() {
    this.root = undefined
  }
}

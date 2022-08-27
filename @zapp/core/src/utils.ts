export function findRelativePath(child: string[], parent?: string[]) {
  if (parent === undefined) {
    return null
  }

  let relativePath: string[] | null = []

  for (let i = 0; i < child.length; i++) {
    if (i < parent.length) {
      if (child[i] !== parent[i]) {
        relativePath = null
        break
      }
    } else {
      relativePath.push(child[i])
    }
  }

  return relativePath
}

export function coerce(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

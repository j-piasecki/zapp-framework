import { PrefixTree } from '../PrefixTree'

test('Empty tree returns no paths', () => {
  const tree = new PrefixTree()
  const paths = tree.getPaths()
  expect(paths.length).toBe(0)
})

test('Handles one node', () => {
  const tree = new PrefixTree()
  tree.addPath(['a'])
  const paths = tree.getPaths()
  expect(paths).toEqual([['a']])
})

test('Tree returns the same path', () => {
  const tree = new PrefixTree()
  tree.addPath(['a', 'b', 'c'])
  const paths = tree.getPaths()
  expect(paths).toEqual([['a', 'b', 'c']])
})

test('Tree returns the shortest path', () => {
  const tree = new PrefixTree()
  tree.addPath(['a', 'b', 'c', 'd', 'e'])
  tree.addPath(['a', 'b', 'c'])
  tree.addPath(['a', 'b'])
  const paths = tree.getPaths()
  expect(paths).toEqual([['a', 'b']])
})

test('Tree returns all paths', () => {
  const tree = new PrefixTree()
  tree.addPath(['a', 'b', 'c', 'd', 'e'])
  tree.addPath(['a', 'b', 'c', 'f', 'g'])
  tree.addPath(['a', 'h'])
  const paths = tree.getPaths()
  expect(paths).toEqual([
    ['a', 'b', 'c', 'd', 'e'],
    ['a', 'b', 'c', 'f', 'g'],
    ['a', 'h'],
  ])
})

test('Tree gets cleared correctly', () => {
  const tree = new PrefixTree()
  tree.addPath(['a', 'b', 'c'])
  tree.clear()
  const paths = tree.getPaths()
  expect(paths).toEqual([])
})

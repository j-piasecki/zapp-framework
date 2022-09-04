import { WorkingTree } from '../working_tree/WorkingTree'
import { Stack } from '../working_tree/views/Stack'
import { StackConfig } from '../working_tree/props/StackConfig'
import { StackAlignment } from '../working_tree/props/types'
import { Config } from '../working_tree/props/Config'
import { Renderer } from '../renderer/Renderer'
import { DummyViewManager } from '../renderer/DummyViewManager'

jest.useFakeTimers()
Renderer.setViewManager(new DummyViewManager())

function getRenderedTreeString() {
  return JSON.stringify(Renderer.getCurrentTree(), undefined, 2)
}

afterEach(() => {
  WorkingTree.dropAll()
  jest.setSystemTime(0)
})

test('Children of Stack(alignment=TopStart) get positioned correctly', () => {
  Stack(StackConfig('stack').width(400).height(400).alignment(StackAlignment.TopStart).padding(10), () => {
    Stack(Config('inner.1').width(200).height(200))
    Stack(Config('inner.2').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Stack(alignment=TopCenter) get positioned correctly', () => {
  Stack(StackConfig('stack').width(400).height(400).alignment(StackAlignment.TopCenter).padding(10), () => {
    Stack(Config('inner.1').width(200).height(200))
    Stack(Config('inner.2').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Stack(alignment=TopEnd) get positioned correctly', () => {
  Stack(StackConfig('stack').width(400).height(400).alignment(StackAlignment.TopEnd).padding(10), () => {
    Stack(Config('inner.1').width(200).height(200))
    Stack(Config('inner.2').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Stack(alignment=CenterStart) get positioned correctly', () => {
  Stack(StackConfig('stack').width(400).height(400).alignment(StackAlignment.CenterStart).padding(10), () => {
    Stack(Config('inner.1').width(200).height(200))
    Stack(Config('inner.2').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Stack(alignment=Center) get positioned correctly', () => {
  Stack(StackConfig('stack').width(400).height(400).alignment(StackAlignment.Center).padding(10), () => {
    Stack(Config('inner.1').width(200).height(200))
    Stack(Config('inner.2').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Stack(alignment=CenterEnd) get positioned correctly', () => {
  Stack(StackConfig('stack').width(400).height(400).alignment(StackAlignment.CenterEnd).padding(10), () => {
    Stack(Config('inner.1').width(200).height(200))
    Stack(Config('inner.2').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Stack(alignment=BottomStart) get positioned correctly', () => {
  Stack(StackConfig('stack').width(400).height(400).alignment(StackAlignment.BottomStart).padding(10), () => {
    Stack(Config('inner.1').width(200).height(200))
    Stack(Config('inner.2').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Stack(alignment=BottomCenter) get positioned correctly', () => {
  Stack(StackConfig('stack').width(400).height(400).alignment(StackAlignment.BottomCenter).padding(10), () => {
    Stack(Config('inner.1').width(200).height(200))
    Stack(Config('inner.2').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Stack(alignment=BottomEnd) get positioned correctly', () => {
  Stack(StackConfig('stack').width(400).height(400).alignment(StackAlignment.BottomEnd).padding(10), () => {
    Stack(Config('inner.1').width(200).height(200))
    Stack(Config('inner.2').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

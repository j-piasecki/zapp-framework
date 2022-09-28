import { WorkingTree } from '../working_tree/WorkingTree'
import { Stack } from '../working_tree/views/Stack'
import { ColumnConfig } from '../working_tree/props/ColumnConfig'
import { Alignment, Arrangement } from '../working_tree/props/types'
import { Config } from '../working_tree/props/Config'
import { Renderer } from '../renderer/Renderer'
import { RenderedTree } from '../renderer/RenderedTree'
import { DummyViewManager } from '../renderer/DummyViewManager'
import { Column } from '../working_tree/views/Column'
import { setViewManager } from '../renderer/ViewManager'

jest.useFakeTimers()
setViewManager(new DummyViewManager())

function getRenderedTreeString() {
  return JSON.stringify(RenderedTree.current, undefined, 2)
}

afterEach(() => {
  WorkingTree.dropAll()
  jest.setSystemTime(0)
})

test('Children of Column(alignment=Start) get positioned correctly', () => {
  Column(
    ColumnConfig('column').width(400).height(400).alignment(Alignment.Start).padding(10),
    () => {
      Stack(Config('inner.1').width(50).height(50))
      Stack(Config('inner.2').width(80).height(80))
      Stack(Config('inner.3').width(100).height(100))
    }
  )

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Column(alignment=Center) get positioned correctly', () => {
  Column(
    ColumnConfig('column').width(400).height(400).alignment(Alignment.Center).padding(10),
    () => {
      Stack(Config('inner.1').width(50).height(50))
      Stack(Config('inner.2').width(80).height(80))
      Stack(Config('inner.3').width(100).height(100))
    }
  )

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Column(alignment=End) get positioned correctly', () => {
  Column(ColumnConfig('column').width(400).height(400).alignment(Alignment.End).padding(10), () => {
    Stack(Config('inner.1').width(50).height(50))
    Stack(Config('inner.2').width(80).height(80))
    Stack(Config('inner.3').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Column(arrangement=Start) get positioned correctly', () => {
  Column(
    ColumnConfig('column').width(400).height(400).arrangement(Arrangement.Start).padding(10),
    () => {
      Stack(Config('inner.1').width(50).height(50))
      Stack(Config('inner.2').width(80).height(80))
      Stack(Config('inner.3').width(100).height(100))
    }
  )

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Column(arrangement=Center) get positioned correctly', () => {
  Column(
    ColumnConfig('column').width(400).height(400).arrangement(Arrangement.Center).padding(10),
    () => {
      Stack(Config('inner.1').width(50).height(50))
      Stack(Config('inner.2').width(80).height(80))
      Stack(Config('inner.3').width(100).height(100))
    }
  )

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Column(arrangement=End) get positioned correctly', () => {
  Column(
    ColumnConfig('column').width(400).height(400).arrangement(Arrangement.End).padding(10),
    () => {
      Stack(Config('inner.1').width(50).height(50))
      Stack(Config('inner.2').width(80).height(80))
      Stack(Config('inner.3').width(100).height(100))
    }
  )

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Column(arrangement=SpaceBetween) get positioned correctly', () => {
  Column(
    ColumnConfig('column').width(400).height(400).arrangement(Arrangement.SpaceBetween).padding(10),
    () => {
      Stack(Config('inner.1').width(50).height(50))
      Stack(Config('inner.2').width(80).height(80))
      Stack(Config('inner.3').width(100).height(100))
    }
  )

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Column(arrangement=SpaceAround) get positioned correctly', () => {
  Column(
    ColumnConfig('column').width(400).height(400).arrangement(Arrangement.SpaceAround).padding(10),
    () => {
      Stack(Config('inner.1').width(50).height(50))
      Stack(Config('inner.2').width(80).height(80))
      Stack(Config('inner.3').width(100).height(100))
    }
  )

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Column(arrangement=SpaceEvenly) get positioned correctly', () => {
  Column(
    ColumnConfig('column').width(400).height(400).arrangement(Arrangement.SpaceEvenly).padding(10),
    () => {
      Stack(Config('inner.1').width(50).height(50))
      Stack(Config('inner.2').width(80).height(80))
      Stack(Config('inner.3').width(100).height(100))
    }
  )

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

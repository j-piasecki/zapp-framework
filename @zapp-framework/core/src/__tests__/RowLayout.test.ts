import { WorkingTree } from '../working_tree/WorkingTree'
import { Stack } from '../working_tree/views/Stack'
import { RowConfig } from '../working_tree/props/RowConfig'
import { Alignment, Arrangement } from '../working_tree/props/types'
import { Config } from '../working_tree/props/BaseConfig'
import { Renderer } from '../renderer/Renderer'
import { DummyViewManager } from '../renderer/DummyViewManager'
import { Row } from '../working_tree/views/Row'
import { setViewManager } from '../renderer/ViewManager'
import { RenderedTree } from '../renderer/RenderedTree'

jest.useFakeTimers()
setViewManager(new DummyViewManager())

function getRenderedTreeString() {
  return JSON.stringify(RenderedTree.current, undefined, 2)
}

afterEach(() => {
  WorkingTree.dropAll()
  jest.setSystemTime(0)
})

test('Children of Row(alignment=Start) get positioned correctly', () => {
  Row(RowConfig('row').width(400).height(400).alignment(Alignment.Start).padding(10), () => {
    Stack(Config('inner.1').width(50).height(50))
    Stack(Config('inner.2').width(80).height(80))
    Stack(Config('inner.3').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Row(alignment=Center) get positioned correctly', () => {
  Row(RowConfig('row').width(400).height(400).alignment(Alignment.Center).padding(10), () => {
    Stack(Config('inner.1').width(50).height(50))
    Stack(Config('inner.2').width(80).height(80))
    Stack(Config('inner.3').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Row(alignment=End) get positioned correctly', () => {
  Row(RowConfig('row').width(400).height(400).alignment(Alignment.End).padding(10), () => {
    Stack(Config('inner.1').width(50).height(50))
    Stack(Config('inner.2').width(80).height(80))
    Stack(Config('inner.3').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Row(arrangement=Start) get positioned correctly', () => {
  Row(RowConfig('row').width(400).height(400).arrangement(Arrangement.Start).padding(10), () => {
    Stack(Config('inner.1').width(50).height(50))
    Stack(Config('inner.2').width(80).height(80))
    Stack(Config('inner.3').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Row(arrangement=Center) get positioned correctly', () => {
  Row(RowConfig('row').width(400).height(400).arrangement(Arrangement.Center).padding(10), () => {
    Stack(Config('inner.1').width(50).height(50))
    Stack(Config('inner.2').width(80).height(80))
    Stack(Config('inner.3').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Row(arrangement=End) get positioned correctly', () => {
  Row(RowConfig('row').width(400).height(400).arrangement(Arrangement.End).padding(10), () => {
    Stack(Config('inner.1').width(50).height(50))
    Stack(Config('inner.2').width(80).height(80))
    Stack(Config('inner.3').width(100).height(100))
  })

  WorkingTree.performUpdate()
  Renderer.commit(WorkingTree.root)
  Renderer.render()

  expect(getRenderedTreeString()).toMatchSnapshot()
})

test('Children of Row(arrangement=SpaceBetween) get positioned correctly', () => {
  Row(
    RowConfig('row').width(400).height(400).arrangement(Arrangement.SpaceBetween).padding(10),
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

test('Children of Row(arrangement=SpaceAround) get positioned correctly', () => {
  Row(
    RowConfig('row').width(400).height(400).arrangement(Arrangement.SpaceAround).padding(10),
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

test('Children of Row(arrangement=SpaceEvenly) get positioned correctly', () => {
  Row(
    RowConfig('row').width(400).height(400).arrangement(Arrangement.SpaceEvenly).padding(10),
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

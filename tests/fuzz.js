import StandardChannel from '../src/channels/standardChannel'
import StandardNode from '../src/nodes/standardNode'
import Flow from '../src/flow'
import Application from '../src/application'

const test = require('ava')
const Action = require('../src/action')
const rangedFuzzing = require('fuzzur')

const rangedFuzzingOptions = {}

/**
 * [createApp description]
 * @return {[type]} [description]
 */
function createApp () {
  const app = new Application(undefined, 'Test App', {
    logLevel: 2
  })

  const doubleXAction = new Action(app, undefined, 'doubleX', function doubleX () {
    this.set('x', this.get('x') * 2)
  })
  const halveXAction = new Action(app, undefined, 'halveX', function halveX () {
    this.set('x', this.get('x') / 2)
  })
  const addXAndYAction = new Action(app, undefined, 'addXAndY', function addXAndY () {
    this.set('x', this.get('x') + this.get('y'))
  })
  const subtractXFromYAction = new Action(app, undefined, 'subtractXFromY', function subtractXFromY () {
    this.set('y', this.get('x') - this.get('y'))
  })
  const throwError = new Action(app, undefined, 'throwError', function throwError () {
    this.set('e', this.get('e') + 1)
    throw new Error('We break here')
  })
  const setXYToOne = new Action(app, undefined, 'setXYToOne', function setXYToOne () {
    this.set('x', 1)
    this.set('y', 1)
  })
  const delayTwentyMilliseconds = new Action(app, undefined, 'delayTwentyMilliseconds', function delayTwentyMilliseconds () {
    return new Promise(resolve => setTimeout(() => {
      this.set('y', this.get('y') * 10)
      resolve()
    }, 20))
  })
  const waitForDelay = new Action(app, undefined, 'waitForDelay', function waitForDelay () {
    return this.waitFor(this.get('waitForDelayId'))
  })

  app.registerAction(doubleXAction.name, doubleXAction)
  app.registerAction(halveXAction.name, halveXAction)
  app.registerAction(addXAndYAction.name, addXAndYAction)
  app.registerAction(subtractXFromYAction.name, subtractXFromYAction)
  app.registerAction(setXYToOne.name, setXYToOne)
  app.registerAction(throwError.name, throwError)
  app.registerAction(delayTwentyMilliseconds.name, delayTwentyMilliseconds)
  app.registerAction(waitForDelay.name, waitForDelay)

  return app
}

test('Fuzz Testing Request', async t => {
  const app = createApp()
  app.listen()
  const flow = new Flow(app, undefined, 'Test Flow', {}, undefined, 'GET', '/testFlow', [ 'x', 'y' ])
  app.setPublicFlow(flow)

  const doubleXNode = new StandardNode(app, undefined, 'Double X', [], [], [ app.getAction('doubleX') ])
  const channelA = new StandardChannel(app, undefined, 'Channel', undefined, [], undefined, [])
  const addXAndYNode = new StandardNode(app, undefined, 'Add X and Y', [], [], [ app.getAction('addXAndY') ])
  const channelB = new StandardChannel(app, undefined, 'Channel', undefined, [], undefined, [])
  const halveXNode = new StandardNode(app, undefined, 'Add X and Y', [], [], [ app.getAction('halveX') ])
  const channelC = new StandardChannel(app, undefined, 'Channel', undefined, [], undefined, [])
  const subtractXFromYNode = new StandardNode(app, undefined, 'Add X and Y', [], [], [ app.getAction('subtractXFromY') ])

  flow.connect(doubleXNode)
  doubleXNode.connect(channelA)
  channelA.connect(addXAndYNode)
  addXAndYNode.connect(channelB)
  channelB.connect(halveXNode)
  halveXNode.connect(channelC)
  channelC.connect(subtractXFromYNode)

  const request = async () => {
    return app.request('GET', '/testFlow', rangedFuzzing.mutate({
      x: 7,
      y: 10
    }, rangedFuzzingOptions))
  }

  const requests = []

  for (var i = 0; i < 1000; i++) {
    requests.push(request())
  }

  await t.notThrowsAsync(Promise.all(requests))
})

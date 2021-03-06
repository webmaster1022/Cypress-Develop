import { returnMockRequire, register } from '@packages/web-config/node-jsdom-setup'
import 'regenerator-runtime/runtime'
import sinon from 'sinon'

const driverMock = {}

register({
  enzyme: require('enzyme'),
  EnzymeAdapter: require('enzyme-adapter-react-16'),
  chaiEnzyme: require('chai-enzyme'),
  requireOverride (depPath) {
    if (depPath === '@packages/driver') {
      return driverMock
    }

    // TODO: refactor w/ regex
    if (depPath.includes('.gif')) {
      return ''
    }
  },
})

returnMockRequire('@packages/socket/lib/browser', {
  client () {
    return { emit: () => {}, on: () => {} }
  },
})

const _useFakeTimers = sinon.useFakeTimers
let timers = []

sinon.useFakeTimers = function (...args) {
  const ret = _useFakeTimers.apply(this, args)

  timers.push(ret)
}

beforeEach(() => {
  driverMock.$ = sinon.stub().throws('$ called without being stubbed')
})

afterEach(() => {
  timers.forEach((clock) => {
    return clock.restore()
  })

  timers = []
})

import { setToken } from 'components/TokenService'

const OLD_ENV = process.env
const original = console.error

beforeEach(() => {
  jest.resetModules() // this is important - it clears the cache
  console.error = jest.fn()
  process.env = { ...OLD_ENV }
})

afterEach(() => {
  process.env = OLD_ENV
  console.error = original
})

const testRenderApp = async () => {
  const React = require('react')
  const { render, wait } = require('test-utils')
  const { App } = require('./App')
  const { unmount } = render(<App />)
  // wait for async import. shouldn't take too much time
  await wait()
  unmount()
}

it('renders without crashing with ws perfered', async () => {
  process.env.REACT_APP_DEV_PREFER = 'ws'

  await testRenderApp()
})

it('renders without crashing with http perfered', async () => {
  process.env.REACT_APP_DEV_PREFER = 'http'

  await testRenderApp()
})

it('renders without crashing with token', async () => {
  setToken('asdf')

  await testRenderApp()
})

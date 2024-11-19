import client, { type BasedClient } from '@based/client'
import { Provider } from '@based/react'
import { render } from 'react-dom'
import { Counter } from './components/counter'
import { Greetings } from './components/greetings'
import { Logo } from './components/logo'
import './index.css'

import basedConfig from '../../based.js'
export const based: BasedClient = client(basedConfig)

const App = () => {
  return (
    <div className="main">
      <Logo />
      <Counter />
      <Greetings />
    </div>
  )
}

const root = document.getElementById('root')

render(
  <Provider client={based}>
    <App />
  </Provider>,
  root,
)

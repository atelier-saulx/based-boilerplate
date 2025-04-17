import client, { type BasedClient } from '@based/client'
import { Provider as BasedClientProvider } from '@based/react'
import { createRoot } from 'react-dom/client'
import { Counter } from './components/counter.js'
import { Greetings } from './components/greetings.js'
import { Logo } from './components/logo.js'
import './index.css'

import basedConfig from '../../based.js'
export const based: BasedClient = client(basedConfig)
const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)

const App = () => {
  return (
    <div className="main">
      <Logo />
      <Counter />
      <Greetings />
    </div>
  )
}

root.render(
  <BasedClientProvider client={based}>
    <App />
  </BasedClientProvider>,
)

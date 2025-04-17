import client, { type BasedClient } from '@based/client'
import { Provider as BasedClientProvider } from '@based/react'
import { createRoot } from 'react-dom/client'
import basedConfig from '../../based.js'
import { MyCMS } from './components/MyCMS/index.js'

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)
const based: BasedClient = client(basedConfig)

root.render(
  <BasedClientProvider client={based}>
    <MyCMS />
  </BasedClientProvider>,
)

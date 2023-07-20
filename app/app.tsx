import React from 'react'
import { render } from 'react-dom'
import based from '@based/client'
import { Provider, useQuery } from '@based/react'

import basedConfig from '../based.json'
export const client = based(basedConfig)

const App = () => {
  const { data: counter, loading } = useQuery('counter')
  return (
    <div
      style={{
        background: '#131313',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <img
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        src="https://user-images.githubusercontent.com/683825/203369546-5b50d2f8-71cc-4d13-a7a1-f9a67f2072f6.svg"
      />
      <h2
        style={{
          color: '#bbbbbb',
          paddingTop: '60px',
          fontFamily: 'sans-serif',
          fontWeight: 800,
          fontSize: '20pt',
        }}
      >
        Hello World! {loading ? '-' : counter}
      </h2>
    </div>
  )
}

render(
  <Provider client={client}>
    <App />
  </Provider>,
  document.body
)

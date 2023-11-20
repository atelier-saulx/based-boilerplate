import React from 'react'
import { render } from 'react-dom'
import './globals.css'
import based from '@based/client'
import { Provider, useQuery } from '@based/react'
import { Avatar, TopNavigation, color, styled } from '@based/ui'
import { Login } from './Login'

import basedConfig from '../based.json'
export const client = based(basedConfig)

const App = () => {
  const { data: counter, loading } = useQuery('counter')

  return <Login />

  return (
    <styled.div
      style={{
        backgroundColor: color('background', 'default'),

        paddingTop: 50,
      }}
    >
      <TopNavigation>
        <Avatar>asdasd</Avatar>
      </TopNavigation>
    </styled.div>
  )
}

render(
  <Provider client={client}>
    <App />
  </Provider>,
  document.body
)

import React from 'react'
import { render } from 'react-dom'
// import based from '@based/client'

// Don't forget to edit your based.json file with your project info
//
// import basedConfig from '../based.json'
// export const client = based(basedConfig)

const App = () => {
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
        Hello World!
      </h2>
    </div>
  )
}

render(<App />, document.body)

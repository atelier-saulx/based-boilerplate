import React from 'react'
import ReactDOM from 'react-dom/client'
import { useAuthState, useQuery } from '@based/react'
import based from '@based/client'
import basedConfig from '../based.json'
import { useRoute } from 'kabouter'
import { styled } from 'inlines'
import { Content } from './Content'
import { FileLibrary } from './Files'
import { SideBar } from './Components/Sidebar'
import { SchemaBuilder } from './Schema'
import { Login } from './UserManagement/Login'
import { Management } from './UserManagement/Management'
import { Provider, color } from '@based/ui'
import { TopBar } from './Components/TopBar'
import { Profile } from './UserManagement/Profile'
import { Dashboard } from './Components/Dashboard'

export const client = based(basedConfig)

export const App = () => {
  const authState = useAuthState()
  const route = useRoute('[section]')
  const section = route.query.section

  const { data, loading } = useQuery('db', {
    $id: authState.userId,
    profileImg: true,
  })
  if (!authState.userId) return <Login />

  return (
    <styled.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: color('background', 'default'),
      }}
    >
      <TopBar data={data} client={client} />
      <styled.div style={{ display: 'flex', flexDirection: 'row' }}>
        <SideBar />
        <div style={{ marginTop: 65, width: '100%' }}>
          {section === 'file-library' ? (
            <FileLibrary />
          ) : section === 'schema-builder' ? (
            <SchemaBuilder />
          ) : section === 'profile' ? (
            <Profile />
          ) : section === 'user-management' ? (
            <Management />
          ) : !section ? (
            <Dashboard />
          ) : (
            <Content />
          )}
        </div>
      </styled.div>
    </styled.div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <Provider client={client}>
    <App />
  </Provider>
)

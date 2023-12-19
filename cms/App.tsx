import React, { useState, useEffect } from 'react'
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
import { Login } from './Settings/UserManagement/Login'
import { Management } from './Settings/UserManagement/Management'
import { Provider, color } from '@based/ui'
import { TopBar } from './Components/TopBar'
import { Profile } from './Settings/UserManagement/Profile'
import { Dashboard } from './Components/Dashboard'
import { DatabaseSettings } from './Settings/Database'
import { GeneralSettings } from './Settings/General'
import { Docs } from './Docs'

export const client = based(basedConfig)

export const App = () => {
  const authState = useAuthState()
  const route = useRoute('[section]')
  const section = route.query.section

  const { data, loading } = useQuery('db', {
    $id: authState.userId,
    profileImg: true,
  })

  // if (!authState.userId) return <Login />

  const { data: schema, loading: loadingSchema } = useQuery('db:schema')

  const [selectedLang, setSelectedLang] = useState(schema?.languages[0])

  return !authState.userId ? (
    <Login />
  ) : (
    <styled.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: color('background', 'default'),
      }}
    >
      <TopBar
        data={data}
        client={client}
        languages={schema?.languages}
        selectedLang={selectedLang || schema?.languages[0]}
        setSelectedLang={setSelectedLang}
      />
      <styled.div style={{ display: 'flex', flexDirection: 'row' }}>
        {selectedLang}
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
          ) : section === 'db-settings' ? (
            <DatabaseSettings />
          ) : section === 'general-settings' ? (
            <GeneralSettings languages={schema?.languages} />
          ) : section === 'docs' ? (
            <Docs />
          ) : !section ? (
            <Dashboard />
          ) : (
            <Content selectedLang={selectedLang || schema?.languages[0]} />
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

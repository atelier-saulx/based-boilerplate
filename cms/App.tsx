import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { useAuthState, useQuery } from '@based/react'
import based from '@based/client'
import basedConfig from '../based.json'
import { useRoute } from 'kabouter'
import { styled } from 'inlines'
import { Modal, ScrollArea } from '@based/ui'
import { Content } from './Components/Content'
// import { FileLibrary } from './Files'
import { Menu } from './Components/Menu'
import { SchemaBuilder } from './Components/SchemaBuilder'
import { Login } from './Settings/UserManagement/Login'
import { Management } from './Settings/UserManagement/Management'
import { color } from '@based/ui'
import { Provider } from '@based/react'
import { TopBar } from './Components/TopBar'
import { Profile } from './Settings/UserManagement/Profile'
import { Dashboard } from './Components/Dashboard'
import { DatabaseSettings } from './Settings/Database'
import { GeneralSettings } from './Settings/General'

export const client = based(basedConfig)

export const App = () => {
  const authState = useAuthState()
  const route = useRoute('[section]')
  const section = route.query.section

  const { data, loading } = useQuery('db', {
    $id: authState.userId,
    profileImg: true,
    name: true,
  })

  const { data: schema, loading: loadingSchema } = useQuery('db:schema')
  const [selectedLang, setSelectedLang] = useState(schema?.languages[0])

  return !authState.userId ? (
    <Login />
  ) : (
    <styled.div>
      <TopBar
        data={data}
        client={client}
        languages={schema?.languages}
        selectedLang={selectedLang || schema?.languages[0]}
        setSelectedLang={setSelectedLang}
      />
      <styled.div style={{ display: 'flex', flexDirection: 'row' }}>
        <Menu />
        <div style={{ width: '100%' }}>
          {section === 'file-library' ? (
            <>files</>
          ) : section === 'schema-builder' ? (
            <SchemaBuilder />
          ) : // ) : section === 'profile' ? (
          //   <Profile />
          // ) : section === 'user-management' ? (
          //   <Management />
          // ) : section === 'db-settings' ? (
          //   <DatabaseSettings />
          // ) : section === 'general-settings' ? (
          //   <GeneralSettings languages={schema?.languages} />
          // ) : section === 'docs' ? (
          //   <Docs />
          !section ? (
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
    <Modal.Provider>
      <App />
    </Modal.Provider>
  </Provider>
)

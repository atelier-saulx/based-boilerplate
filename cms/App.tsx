import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useAuthState } from '@based/react'
import based from '@based/client'
import basedConfig from '../based.json'
import { useRoute } from 'kabouter'
import { styled } from 'inlines'
import { Content } from './Content'
import { FileLibrary } from './Files'
import { SideBar } from './Sidebar'
import { SchemaBuilder } from './Schema'
import { Login } from './UserManagement/Login'
import { Management } from './UserManagement/Management'
import { Avatar, Button, Dropdown, IconLogOut, TopNavigation } from '@based/ui'
import { Logo } from './Sidebar/Logo'
import { Profile } from './UserManagement/Profile'

export const client = based(basedConfig)

export const App = () => {
  const route = useRoute('[section]')
  const authState = useAuthState()
  const section = route.query.section
  if (!authState.userId) return <Login />
  return (
    <styled.div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <TopNavigation>
        <Logo />
        <Dropdown.Root>
          <Dropdown.Trigger>
            <Button style={{ marginLeft: 'auto' }} size="xsmall">
              <Avatar>{authState.userId}</Avatar>
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Items>
            <Dropdown.Item
              onClick={() =>
                //@ts-expect-error

                route.setQuery({ section: 'profile', type: null, id: null })
              }
            >
              Profile
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item
              onClick={() =>
                client.setAuthState({ token: undefined, persistent: true })
              }
              icon={<IconLogOut />}
            >
              Logout
            </Dropdown.Item>
          </Dropdown.Items>
        </Dropdown.Root>
      </TopNavigation>
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
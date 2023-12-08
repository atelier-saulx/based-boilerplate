import React from 'react'
import {
  TopNavigation,
  Avatar,
  Button,
  Dropdown,
  IconEye,
  IconLogOut,
  useTheme,
} from '@based/ui'
import { Logo } from '../Sidebar/Logo'
import { useRoute } from 'kabouter'

import { useAuthState } from '@based/react'

export const TopBar = ({ data, client }) => {
  const authState = useAuthState()
  const route = useRoute('[section]')
  const section = route.query.section
  const { theme, setTheme } = useTheme()

  return (
    <TopNavigation>
      <Logo
        style={{ cursor: 'pointer' }}
        onClick={() => {
          // @ts-ignore
          route.setQuery({ section: null })
        }}
      />

      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button style={{ marginLeft: 'auto' }} size="xsmall">
            <Avatar src={data?.profileImg}>{authState.userId}</Avatar>
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
            icon={<IconEye />}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item
            onClick={() => {
              //@ts-expect-error
              route.setQuery({ section: null, type: null, id: null })
              client.setAuthState({ token: undefined, persistent: true })
            }}
            icon={<IconLogOut />}
          >
            Logout
          </Dropdown.Item>
        </Dropdown.Items>
      </Dropdown.Root>
    </TopNavigation>
  )
}

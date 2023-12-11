import React from 'react'
import {
  TopNavigation,
  Avatar,
  Button,
  Row,
  Dropdown,
  IconEye,
  IconLogOut,
  useTheme,
} from '@based/ui'
import { Logo } from '../Sidebar/Logo'
import { useRoute } from 'kabouter'
import { styled } from '@based/ui'
import { useAuthState } from '@based/react'
import { SelectInput } from '@based/ui/dist/components/Input/SelectInput'

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

      <Row style={{ marginLeft: 'auto' }}>
        <styled.div style={{ width: 124, marginLeft: 'auto', marginRight: 12 }}>
          <SelectInput options={[{ value: 'en', label: 'English' }]} />
        </styled.div>

        <Dropdown.Root>
          <Dropdown.Trigger>
            <Button size="xsmall">
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
      </Row>
    </TopNavigation>
  )
}

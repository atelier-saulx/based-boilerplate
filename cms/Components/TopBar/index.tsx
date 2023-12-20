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
  Input,
} from '@based/ui'
import { Logo } from '../Sidebar/Logo'
import { useRoute } from 'kabouter'
import { styled } from '@based/ui'
import { useAuthState, useQuery } from '@based/react'
import { languages as allLangs } from './languages'

export const TopBar = ({
  data,
  client,
  languages,
  selectedLang,
  setSelectedLang,
}) => {
  const route = useRoute('[section]')

  const { theme, setTheme } = useTheme()

  const { data: userData } = useQuery('db', {
    $id: client.authState.userId,
    name: true,
  })

  const langOptions = languages?.map((lang) => ({
    value: lang,
    label: allLangs[lang],
  }))

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
        <styled.div style={{ width: 154, marginLeft: 'auto', marginRight: 12 }}>
          <Input
            type="select"
            style={{ overflow: 'hidden' }}
            value={selectedLang}
            options={langOptions || []}
            onChange={(v) => {
              console.log(v)
              setSelectedLang(v)
            }}
          />
        </styled.div>

        <Dropdown.Root>
          <Dropdown.Trigger>
            <Button size="xsmall">
              <Avatar src={data?.profileImg}>{userData?.name}</Avatar>
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
